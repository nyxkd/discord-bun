import { Collection, type APIApplicationCommand, ChatInputCommandInteraction } from 'discord.js';
import { ApplicationCommandsAPI } from '@discordjs/core';

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { Hash } from '../schemas/Hash';

class CommandHandler {
    client;
    APIClient: ApplicationCommandsAPI;

    constructor(client) {
        this.client = client;
    }

    async initialize() {
        const hasher = new Bun.CryptoHasher('sha256');

        const commandsPath = join(process.cwd(), 'commands');
        const commandFiles = (await readdir(commandsPath)).filter(
            (file) => file.endsWith('.ts') || file.endsWith('.js')
        );

        // This collection will contain the commands that are in the commands folder
        const localCommands = new Collection<string, Command<ChatInputCommandInteraction>>();

        for (const file of commandFiles) {
            const command = (await import(join(commandsPath, file))).default;
            localCommands.set(command.data.name, command);
        }

        this.APIClient = new ApplicationCommandsAPI(this.client.rest);

        // This collection will contain the commands that are registered in the Discord API
        const testGuildCommands = new Collection<string, APIApplicationCommand>();

        // Get the commands that are registered in the Discord API and store them in the testGuildCommands collection
        await this.APIClient.getGuildCommands(this.client.config.applicationID, this.client.config.testGuildID).then(
            (commands) => {
                for (const command of commands) {
                    testGuildCommands.set(command.name, command);
                }
            }
        );

        for (const command of localCommands) {
            const localCommand = command[1];
            const testGuildCommand = testGuildCommands.get(localCommand.data.name);

            if (!testGuildCommand) {
                await this.APIClient.createGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    localCommand.data
                );

                this.client.logger.log('commandHandler', `Created guild command: ${localCommand.data.name}`);
            } else {
                const hash = await hasher.update(JSON.stringify(localCommand.data)).digest('hex');
                let storedHash = await Hash.findOne({
                    where: {
                        command: localCommand.data.name
                    }
                });

                if (!storedHash) {
                    this.client.logger.log(
                        'commandHandler',
                        `Hash for command ${localCommand.data.name} does not exist, creating one...`
                    );

                    await Hash.create({ command: localCommand.data.name, hash });

                    this.client.logger.log('commandHandler', `Created hash for command ${localCommand.data.name}`);
                }

                storedHash = await Hash.findOne({
                    where: {
                        command: localCommand.data.name
                    }
                });

                if (storedHash.hash !== hash) {
                    this.client.logger.log(
                        'commandHandler',
                        `Hash for command ${localCommand.data.name} does not match, editing command...`
                    );

                    await this.APIClient.editGuildCommand(
                        this.client.config.applicationID,
                        this.client.config.testGuildID,
                        testGuildCommand.id,
                        localCommand.data
                    );

                    this.client.logger.log('commandHandler', `Edited guild command: ${localCommand.data.name}`);
                }
            }
        }

        const hashes = await Hash.findAll();

        for (const hash of hashes) {
            if (!localCommands.has(hash.command)) {
                await Hash.destroy({ where: { command: hash.command } });

                this.client.logger.log('commandHandler', `Deleted hash for command ${hash.command}`);

                const testGuildCommand = testGuildCommands.get(hash.command);

                await this.APIClient.deleteGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    testGuildCommand.id
                );

                this.client.logger.log('commandHandler', `Deleted guild command: ${hash.command}`);
            }
        }

        this.client.commands = localCommands;
    }
}

export default CommandHandler;
