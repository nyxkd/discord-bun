import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Test')
            .setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};