import { Collection, type APIApplicationCommand, ChatInputCommandInteraction } from 'discord.js';

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

import { Hash } from '../schemas/Hash';
import type { CryptoHasher } from 'bun';

class CommandHandler {
    client: CustomClient;
    commandsPath: string;
    hasher: CryptoHasher;

    constructor(client: CustomClient) {
        this.client = client;
        this.commandsPath = join(process.cwd(), 'src', 'commands');

        this.hasher = new Bun.CryptoHasher('sha256');
    }

    async initialize() {
        // Collection of commands that are in the commands folder
        const localCommands = new Collection<string, Command<ChatInputCommandInteraction>>();

        const commandsFolders = await readdir(this.commandsPath);

        // read the commands folder recursively and get all the commands
        for (const folder of commandsFolders) {
            const folderPath = join(this.commandsPath, folder);
            const folderStat = await stat(folderPath);

            // Check if the file is a directory
            if (folderStat.isDirectory()) {
                const folderName = folder.charAt(0) + folder.slice(1);
                const commandFiles = (await readdir(folderPath)).filter(
                    (file) => file.endsWith('.ts') || file.endsWith('.js')
                );

                // Recursively read the files in the directory
                for (const file of commandFiles) {
                    const filename = file.split('.').slice(0, -1).join('.');
                    const command = (await import(join(folderPath, file))).default;

                    if (filename !== command.data.name) {
                        this.client.logger.log(
                            'commandHandler',
                            `Filename ${filename} does not match the command name ${command.data.name}. Please make sure they match.`
                        );
                    }

                    this.client.logger.log('commandHandler', `Loaded command: ${folderName}/${command.data.name}`);

                    // Store the command in the localCommands collection
                    localCommands.set(command.data.name, command);
                }
            } else {
                const command = (await import(folderPath)).default;

                this.client.logger.log('commandHandler', `Loaded command: ${command.data.name}`);

                localCommands.set(command.data.name, command);
            }
        }

        // This collection will contain the commands that are registered in the Discord API
        const testGuildCommands = new Collection<string, APIApplicationCommand>();
        const globalCommands = new Collection<string, APIApplicationCommand>();

        // Get the commands that are registered in the Discord API and store them in the globalCommands collection
        await this.client.APIClient.getGlobalCommands(this.client.config.applicationID).then((commands) => {
            for (const command of commands) {
                globalCommands.set(command.name, command);
            }
        });
        this.client.logger.log(
            'commandHandler',
            `We currently have ${globalCommands.size} global commands. List: ${globalCommands.map((c) => c.name).join(', ')}`
        );

        // Get the commands that are registered in the Discord API and store them in the testGuildCommands collection
        await this.client.APIClient.getGuildCommands(
            this.client.config.applicationID,
            this.client.config.testGuildID
        ).then((commands) => {
            for (const command of commands) {
                testGuildCommands.set(command.name, command);
            }
        });

        this.client.logger.log(
            'commandHandler',
            `We currently have ${testGuildCommands.size} test guild commands. List: ${testGuildCommands.map((c) => c.name).join(', ')}`
        );

        for (const command of localCommands) {
            const localCommand = command[1]; // Get the command object from the collection
            const testGuildCommand = testGuildCommands.get(localCommand.data.name);

            if (!testGuildCommand) {
                this.client.logger.log(
                    'commandHandler',
                    `Command ${localCommand.data.name} does not exist, creating...`
                );

                await this.client.APIClient.createGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    JSON.parse(JSON.stringify(localCommand.data))
                );
                this.client.logger.log('commandHandler', `Created guild command: ${localCommand.data.name}`);

                const doesHashExist = await Hash.findOne({
                    where: {
                        command: localCommand.data.name
                    }
                });

                if (!doesHashExist) {
                    await Hash.create({
                        command: localCommand.data.name,
                        hash: this.hasher.update(JSON.stringify(localCommand.data)).digest('hex'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }

                this.client.logger.log('commandHandler', `Created hash for command ${localCommand.data.name}`);
            } else {
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

                    await Hash.create({
                        command: localCommand.data.name,
                        hash: this.hasher.update(JSON.stringify(localCommand.data)).digest('hex'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    this.client.logger.log('commandHandler', `Created hash for command ${localCommand.data.name}`);
                }

                storedHash = await Hash.findOne({
                    where: {
                        command: localCommand.data.name
                    }
                });

                const hash = this.hasher.update(JSON.stringify(localCommand.data)).digest('hex');
                if (storedHash.hash !== hash) {
                    this.client.logger.log(
                        'commandHandler',
                        `Hash for command ${localCommand.data.name} does not match, editing command...`
                    );

                    await this.client.APIClient.editGuildCommand(
                        this.client.config.applicationID,
                        this.client.config.testGuildID,
                        testGuildCommand.id,
                        JSON.parse(JSON.stringify(localCommand.data))
                    );
                    this.client.logger.log('commandHandler', `Edited guild command: ${localCommand.data.name}`);

                    await storedHash.update({
                        hash,
                        updatedAt: new Date()
                    });

                    this.client.logger.log('commandHandler', `Updated hash for command ${localCommand.data.name}`);
                }
            }
        }

        const hashes = await Hash.findAll();

        for (const hash of hashes) {
            if (!localCommands.has(hash.command)) {
                await Hash.destroy({ where: { command: hash.command } });

                this.client.logger.log('commandHandler', `Deleted hash for command ${hash.command}`);

                const testGuildCommand = testGuildCommands.get(hash.command);

                await this.client.APIClient.deleteGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    testGuildCommand.id
                );

                this.client.logger.log('commandHandler', `Deleted guild command: ${hash.command}`);
            }
        }

        this.client.testGuildCommands = localCommands;
    }
}

export default CommandHandler;
