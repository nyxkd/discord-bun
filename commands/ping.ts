import {
    SlashCommandBuilder,
    EmbedBuilder,
    Colors
} from "discord.js";

import type {
    ChatInputCommandInteraction,
} from "discord.js";

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong! Returns the latency of the bot in ms!'),
    execute: async (interaction) => {
        const wslatency = Date.now() - interaction.createdTimestamp;
        const apilatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .addFields([
                {
                    name: 'WS Latency',
                    value: `**${wslatency}**ms`,
                    inline: true
                },
                {
                    name: 'API Latency',
                    value: `**${apilatency}**ms`,
                    inline: true
                }

            ])
            .setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;