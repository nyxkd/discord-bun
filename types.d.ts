import type { Client, Guild,  CommandInteraction, User, Snowflake, ApplicationCommandOption, ApplicationCommand } from "discord.js";

export interface Config {
    token: Client["token"];
    devIDs: User["id"][];
    testGuildID: Guild["id"];
    isDevelopmentENV: boolean;
}

export interface Command {
    data: {
        name: ApplicationCommand["name"];
        description: ApplicationCommand["description"];
        options?: ApplicationCommandOption[];
        permissions?: ApplicationCommand["permission"];
    },
    execute: (interaction: CommandInteraction) => Promise<void> | void;
}

export interface Event {
    once?: boolean;
    async execute: (client: CustomClient, ...args: any[]) => Promise<void> | void;
}