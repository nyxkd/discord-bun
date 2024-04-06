import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

import type { ChatInputCommandInteraction } from "discord.js";

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command'),
    execute: async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('Test')
            .setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

export default command;