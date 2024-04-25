import type {
    Client,
    ClientApplication,
    User,
    Guild,
    BaseInteraction,
    SlashCommandBuilder,
    ClientEvents,
    SlashCommandSubcommandBuilder,
    Role,
    AutocompleteInteraction
} from 'discord.js';
import type { ClientConfig } from 'pg';
import type { REST } from '@discordjs/rest';

export interface Event<T extends keyof ClientEvents> {
    once?: boolean;
    execute: (client: CustomClient, ...args: any[]) => Promise<void>;
}
declare module 'discord.js' {
    interface Client {
        config: Config;
        logger: Logger;
        applicationID: string;

        testGuildCommands: Collection<string, Command<BaseInteraction>>;
        commands: Collection<string, Command<BaseInteraction>>;
        events: Collection<string, Event>;

        Database: Database;
        EventHandler: EventHandler;
        CommandHandler: CommandHandler;

        rest: REST;
        APIClient: ApplicationCommandsAPI;
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

    interface CustomClient extends Client {
        config: Config;
        logger: Logger;
        applicationID: Client.application.id;

        commands: Collection<string, Command<BaseInteraction>>;
        events: Collection<string, Event>;

        Database: Database;
        EventHandler: EventHandler;
        CommandHandler: CommandHandler;

        rest: REST;
        APIClient: ApplicationCommandsAPI;
    }

    interface Database {
        database: Sequelize;
        client: CustomClient;
        initialize: () => Promise<void>;
    }
    interface Logger {
        log: (...args: any[]) => void;
    }

    interface Command<T extends CommandInteraction> {
        data: Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'> | SlashCommandSubcommandsOnlyBuilder;
        isDevOnly?: boolean;
        execute: (interaction: T) => Promise<void>;
        autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    }

    interface Event<T extends keyof ClientEvents> {
        once?: boolean;
        execute: (client: CustomClient, ...args: ClientEvents[T]) => Promise<void>;
    }
}
