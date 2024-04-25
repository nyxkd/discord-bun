import {
    Client,
    GatewayIntentBits,
    ActivityType,
    Collection,
    type ChatInputCommandInteraction,
    type ClientEvents
} from 'discord.js';

import { ApplicationCommandsAPI } from '@discordjs/core';

import { REST } from '@discordjs/rest';

import type { Event } from '../globals';

import Database from './Database';

import EventHandler from '../handlers/EventHandler';
import CommandHandler from '../handlers/CommandHandler';

import Logger from './Logger';

class CustomClient extends Client {
    readonly config: Config;
    applicationID: string;

    testGuildCommands: Collection<string, Command<ChatInputCommandInteraction>> = new Collection();
    commands: Collection<string, Command<ChatInputCommandInteraction>> = new Collection();
    events: Collection<string, Event<keyof ClientEvents>> = new Collection();

    logger = Logger;

    EventHandler: EventHandler;
    CommandHandler: CommandHandler;
    Database: Database;

    APIClient: ApplicationCommandsAPI;

    constructor(config: Config) {
        super({
            intents: [GatewayIntentBits.Guilds],
            presence: {
                status: 'online',
                activities: [
                    {
                        type: ActivityType.Watching,
                        name: 'the birds. 🦜'
                    }
                ]
            }
        });

        this.config = config;
        this.applicationID = config.applicationID;

        this.Database = new Database(this);
        this.EventHandler = new EventHandler(this);
        this.CommandHandler = new CommandHandler(this);

        this.rest = new REST().setToken(this.config.token);
        this.APIClient = new ApplicationCommandsAPI(this.rest);

        this.rest.on('response', async (response) => {
            this.logger.log('rest', `REST Client has received a response: ${response.method} ${response.path}.`);
        });

        this.rest.on('rateLimited', (rateLimitInfo) => {
            this.logger.log(
                'warn',
                `REST Client has been rate limited! Timeout: ${rateLimitInfo.retryAfter}ms, Limit: ${rateLimitInfo.limit}, Method: ${rateLimitInfo.method}, Route: ${rateLimitInfo.route}`
            );
        });

        this.initialize();
    }

    async initialize() {
        await this.Database.initialize();
        await this.EventHandler.initialize();
        await this.CommandHandler.initialize();

        await this.login(this.config.token);
    }
}

export default CustomClient;
