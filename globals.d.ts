import type {
    Client,
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