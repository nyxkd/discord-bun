import { Client, GatewayIntentBits, ActivityType, Collection } from 'discord.js';
import type { Config, Command, Event } from '../types';

import { REST } from '@discordjs/rest';

import EventHandler from '../handlers/EventHandler';
import CommandHandler from '../handlers/CommandHandler';

import Logger from './Logger';

class CustomClient extends Client {
    readonly config: Config;
    applicationID: string = this.application?.id as string || '1224339063318773780';

    commands: Collection<string, Command> = new Collection();
    events: Collection<string, Event> = new Collection();

    logger = Logger;

    declare rest: REST;

    EventHandler: EventHandler;
    CommandHandler: CommandHandler;


    constructor(config: Config) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
            ],
            presence: {
                status: 'online',
                activities: [
                    {
                        type: ActivityType.Playing,
                        name: 'with discord.js',
                    },
                ],
            }
        });

        this.config = config;
        this.EventHandler = new EventHandler(this);
        this.CommandHandler = new CommandHandler(this);

        this.rest = new REST().setToken(this.config.token);

        this.rest.on('response', (response) => {
            this.logger.log("rest", `REST Client has received a response: ${response.method} ${response.path}`);
        });

        this.rest.on('rateLimited', (rateLimitInfo) => {
            this.logger.log("warn", `REST Client has been rate limited! Timeout: ${rateLimitInfo.retryAfter}ms, Limit: ${rateLimitInfo.limit}, Method: ${rateLimitInfo.method}, Route: ${rateLimitInfo.route}`)
        });

        this.config.isDevelopmentENV ? this.logger.log('warn', 'Development environment detected.') : this.logger.log('warn', 'Production environment detected.');

        this.initialize();
    }

    async initialize() {
        await this.EventHandler.initialize();
        await this.CommandHandler.initialize();

        process.on('unhandledRejection', (error) => {
            this.logger.log('error', `Unhandled promise rejection: ${error}`);
        });

        process.on('uncaughtException', (error) => {
            this.logger.log('error', `Uncaught exception: ${error}`);
        });

        await this.login(this.config.token);
    }
}

export default CustomClient;