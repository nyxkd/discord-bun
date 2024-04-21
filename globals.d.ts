import type {
    Client,
    ClientApplication,
    User,
    Guild,
    BaseInteraction,
    SlashCommandBuilder,
    ClientEvents,
    SlashCommandSubcommandBuilder,
    Role
} from 'discord.js';
import type { ClientConfig } from 'pg';

export interface Event<T extends keyof ClientEvents> {
    once?: boolean;
    execute: (client: CustomClient, ...args: any[]) => Promise<void>;
}
declare module 'discord.js' {
    interface Client {
        config: Config;
        logger: Logger;
        applicationID: string;

        commands: Collection<string, Command<BaseInteraction>>;
        events: Collection<string, Event>;

        EventHandler: EventHandler;
        CommandHandler: CommandHandler;
    }
}

declare global {
    interface Config {
        token: Client['token'];
        applicationID: ClientApplication['id'];
        devIDs: User['id'][];
        testGuildID: Guild['id'];
        premiumRoleID: Role['id'];
        database: {
            name: ClientConfig['database'];
            user: ClientConfig['user'];
            password: ClientConfig['password'];
            host: ClientConfig['host'];
            port: ClientConfig['port'];
        };
    }

    interface Logger {
        log: (...args: any[]) => void;
    }

    interface Command<T extends BaseInteraction> {
        /* data: SlashCommandBuilder; */
        data: any;
        isDevOnly?: boolean;
        execute: (interaction: T) => Promise<void>;
    }

    interface Event<T extends keyof ClientEvents> {
        once?: boolean;
        execute: (client: CustomClient, ...args: ClientEvents[T]) => Promise<void>;
    }
}
