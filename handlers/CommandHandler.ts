import {
    Collection,
    type APIApplicationCommand,
    ChatInputCommandInteraction
} from 'discord.js';
import { ApplicationCommandsAPI } from '@discordjs/core';

import CustomClient from '../structures/CustomClient';

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

class CommandHandler {
    client: CustomClient;
    APIClient: ApplicationCommandsAPI;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async readHash(command: string) {
        // const hash = await Bun.file('hashes.json').json()[command] : throw new Error(`Hash for command ${command} does not exist!`) ?
        const hashes = await Bun.file('hashes.json').json();

        if (!hashes[command]) {
            throw new Error(`Hash for command ${command} does not exist!`);
        }

        return hashes[command];
    }

    async createHash(command: string, hash: string) {
        const hashes = await Bun.file('hashes.json').json();
        hashes[command] = hash;

        await Bun.write('hashes.json', JSON.stringify(hashes, null, 4));
    }

    async deleteHash(command: string) {
        const hashes = await Bun.file('hashes.json').json();
        delete hashes[command];

        await Bun.write('hashes.json', JSON.stringify(hashes, null, 4));
    }

    async initialize() {
        const commandsPath = join(process.cwd(), 'commands');
        const commandFiles = (await readdir(commandsPath)).filter(
            (file) => file.endsWith('.ts') || file.endsWith('.js')
        );

        const hasher = new Bun.CryptoHasher('sha256');

        const doesHasesExist = await Bun.file('hashes.json').exists();
        if (!doesHasesExist) {
            this.client.logger.log(
                'commandHandler',
                'Hashes file does not exist, creating one...'
            );
            await Bun.write('hashes.json', '{}');
        }

        const localCommands = new Collection<
            string,
            Command<ChatInputCommandInteraction>
        >();

        // Populate localCommands with the local commands
        for (const file of commandFiles) {
            const command = (await import(join(commandsPath, file))).default;
            localCommands.set(command.data.name, command);
        }
        // console.table(localCommands.map(command => command.data.name));

        // this.client.logger.log('commandHandler', `Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);
        // this.client.logger.log('commandHandler', `Loaded ${localCommands.size} commands: ${localCommands.map(command => command.data.name).join(', ')}`);

        this.APIClient = new ApplicationCommandsAPI(this.client.rest);

        const guildCommands = new Collection<string, APIApplicationCommand>();

        // Populate guildCommands with the guild commands
        await this.APIClient.getGuildCommands(
            this.client.config.applicationID,
            this.client.config.testGuildID
        ).then(async (commands) => {
            for (const command of commands) {
                guildCommands.set(command.name, command);
            }

            // this.client.logger.log('commandHandler', `Found ${commands.length} guild commands: ${commands.map(command => command.name).join(', ')}`);
        });
        // console.table(guildCommands.map(command => command.name));

        // Check if there are any commands that are on the guild but not local and delete them
        guildCommands.forEach(async (command) => {
            if (!localCommands.has(command.name)) {
                this.APIClient.deleteGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    command.id
                );

                // delete the hash from the hashes file
                const hash = await this.readHash(command.name);
                this.client.logger.log(
                    'commandHandler',
                    `Deleted hash for command ${command.name}: ${hash}`
                );

                this.client.logger.log(
                    'commandHandler',
                    `Deleted guild command: ${command.name}`
                );
            }
        });

        // Check if there are any commands that are local but not on the guild and create them
        localCommands.forEach(async (command) => {
            if (!guildCommands.has(command.data.name)) {
                this.APIClient.createGuildCommand(
                    this.client.config.applicationID,
                    this.client.config.testGuildID,
                    command.data.toJSON()
                );
                this.client.logger.log(
                    'commandHandler',
                    `Registered guild command: ${command.data.name}`
                );
            }
        });

        this.client.commands = localCommands;

        for (const command of this.client.commands.values()) {
            const hashes = await Bun.file('hashes.json').json();

            const hash = await hasher
                .update(JSON.stringify(command.data.toJSON()))
                .digest('hex');
            const existingHash = hashes[command.data.name];

            if (hash !== existingHash) {
                this.client.logger.log(
                    'commandHandler',
                    `Hash for command ${command.data.name} does not match, updating...`
                );

                await this.APIClient.getGuildCommands(
                    this.client.config.applicationID,
                    this.client.config.testGuildID
                ).then(async (commands) => {
                    for (const guildCommand of commands) {
                        if (guildCommand.name === command.data.name) {
                            await this.APIClient.editGuildCommand(
                                this.client.config.applicationID,
                                this.client.config.testGuildID,
                                guildCommand.id,
                                command.data.toJSON()
                            );
                        }
                    }
                });

                this.createHash(command.data.name, hash);
            }

            // check if hashes contain the hashes for a command which is not in the local commands and delete it
            for (const commandName in hashes) {
                if (!this.client.commands.has(commandName)) {
                    this.deleteHash(commandName);
                    this.client.logger.log(
                        'commandHandler',
                        `Deleted hash for command ${commandName}`
                    );
                }
            }

            this.client.logger.log(
                'commandHandler',
                `Hash for command ${command.data.name}: ${hash}`
            );
            this.client.commands.set(command.data.name, command);
        }
    }
}

export default CommandHandler;
