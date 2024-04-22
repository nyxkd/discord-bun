import { Colors, EmbedBuilder, SlashCommandBuilder, bold, italic, type ChatInputCommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder().setName('uptime').setDescription('See the uptime of the bot!'),
    execute: async (interaction) => {
        let seconds = Math.floor(interaction.client.uptime! / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        const embed = new EmbedBuilder()
            .setTitle(italic(`I have been online for ${bold(`${days}d ${hours}h ${minutes}m ${seconds}s`)}`))
            .setColor(Colors.LuminousVividPink);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;
