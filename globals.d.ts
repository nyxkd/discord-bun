import type {
    Client,
    ClientApplication,
    User,
    Guild,
    BaseInteraction,
    SlashCommandBuilder,
    ClientEvents
} from "discord.js";

export interface Event<T extends keyof ClientEvents> {
    once?: boolean;
    execute: (client: CustomClient, ...args: any[]) => Promise<void>;
}

declare global {
    interface Config {
        token: Client["token"];
        applicationID: ClientApplication["id"];
        devIDs: User["id"][];
        testGuildID: Guild["id"];
        isDevelopmentENV: boolean;
    }

    interface Logger {
        log: (...args: any[]) => void;
    }

    interface CustomClient extends Client {
        config: Config;
        logger: Logger;
        applicationID: string;

        commands: Collection<string, Command<BaseInteraction>>;
        events: Collection<string, Event<any>>;

        EventHandler: EventHandler;
        CommandHandler: CommandHandler;
    }

    interface Command<T extends BaseInteraction> {
        data: SlashCommandBuilder;
        execute: (interaction: T) => Promise<void>;
    }

    interface Event<T extends keyof ClientEvents> {
        once?: boolean;
        execute: (client: CustomClient, ...args: ClientEvents[T]) => Promise<void>;
    }
}