import { Collection, Routes } from 'discord.js';
import type { ApplicationCommand, ChatInputCommandInteraction } from 'discord.js';

import CustomClient from '../structures/CustomClient';

import { join } from "node:path";
import { readdir } from "node:fs/promises";

class CommandHandler {
    client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async initialize() {
        const alreadyRegisteredCommands = new Collection<string, ApplicationCommand>();
        const commandsPath = join(__dirname, '..', 'commands');
        const commandFiles = (await readdir(commandsPath)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        const hasher = new Bun.CryptoHasher('md5');

        this.client.rest.get(
            Routes.applicationCommands(this.client.applicationID)
        ).then((commands: ApplicationCommand[]) => {
            commands.forEach(command => {
                alreadyRegisteredCommands.set(command.name, command);
            });

            this.client.logger.log('silly', `Already registered commands: ${commands.map(command => command.name).join(', ')}`);
        })

        this.client.logger.log('silly', `Found ${commandFiles.length} commands. Commands: ${commandFiles.map(file => file.split('.')[0]).join(', ')}`);

        const doesHashesExist = await Bun.file('hashes.json').exists();

        if (!doesHashesExist) {
            this.client.logger.log('warn', 'Hashes file does not exist. Creating one now...');

            Bun.write('hashes.json', '{}')
                .then(() => {
                    this.client.logger.log('silly', 'Created hashes file.');
                });
        }

        await Bun.file('hashes.json').json()
            .then(async (hashes) => {
                this.client.logger.log('silly', `Hashes: ${JSON.stringify(hashes)}`);

                for (const file of commandFiles) {
                    const command: Command<ChatInputCommandInteraction> = (await import(join(commandsPath, file))).default;
                    const commandData = command.data;

                    const savedHash = hashes[commandData.name];
                    const currentHash = hasher.update(JSON.stringify(commandData)).digest('hex');

                    if (savedHash && savedHash !== currentHash) {
                        this.client.logger.log('silly', `Command ${commandData.name} has changed. Old hash: ${savedHash}, new hash: ${currentHash}`);

                        hashes[commandData.name] = currentHash;

                        this.client.rest.get(
                            Routes.applicationGuildCommands(this.client.applicationID, this.client.config.testGuildID)
                        ).then((commands: ApplicationCommand[]) => {
                            const commandToSelect = commands.find(c => c.name === commandData.name);

                            this.client.logger.log('silly', `Command to select: ${JSON.stringify(commandToSelect)}`);

                            this.client.rest.patch(
                                Routes.applicationGuildCommand(this.client.applicationID, this.client.config.testGuildID, commandToSelect.id),
                                {
                                    body: commandData,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            )
                                .then(() => {
                                    this.client.logger.log('silly', `Updated command ${commandData.name} in test guild.`);
                                })
                                .catch((error) => {
                                    this.client.logger.log('error', `Error updating command ${commandData.name} in test guild: ${error}`);
                                });
                        });

                        Bun.write('hashes.json', JSON.stringify(hashes, null, 4))
                            .then(() => {
                                this.client.logger.log('silly', `Wrote hashes to file.`);
                            });
                    }

                    if (!hashes[commandData.name]) {
                        this.client.logger.log('warn', `Command ${commandData.name} has no hash!`);

                        hashes[commandData.name] = hasher.update(JSON.stringify(commandData)).digest('hex');

                        Bun.write('hashes.json', JSON.stringify(hashes, null, 4))
                            .then(() => {
                                this.client.logger.log('silly', `Wrote hash for ${commandData.name} to file.`);
                            });
                    }

                    this.client.commands.set(command.data.name, command);
                    this.client.logger.log('commandHandler', `Loaded command: ${commandData.name}. Hash: ${hashes[commandData.name]}`);
                };
            });
            
    }
}

export default CommandHandler;