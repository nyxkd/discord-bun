import type {
    Client,
    ClientApplication,
    User,
    Guild,
    CommandInteraction,
    SlashCommandBuilder,
    ClientEvents,
    SlashCommandSubcommandBuilder,
    Role,
    AutocompleteInteraction,
    SlashCommandSubcommandsOnlyBuilder,
    Collection
} from 'discord.js';
import type { ClientConfig } from 'pg';
import type { REST } from '@discordjs/rest';
import type { ApplicationCommandsAPI } from '@discordjs/core';

declare module 'discord.js' {
    interface Client {
        config: Config;
        logger: Logger;
        applicationID: string;

        testGuildCommands: Collection<string, Command<T>>;
        commands: Collection<string, Command<T>>;
        events: Collection<string, ClientEvent>;

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

        testGuildCommands: Collection<string, Command<T>>;
        commands: Collection<string, Command<T>>;
        events: Collection<string, ClientEvent>;

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

    interface ClientEvent<T extends keyof ClientEvents> {
        once?: boolean;
        execute: (client: CustomClient, ...args: ClientEvents[T]) => Promise<void>;
    }
}
