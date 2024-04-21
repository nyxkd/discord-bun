import {
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
    PermissionFlagsBits,
    type ChatInputCommandInteraction
} from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        const embed = new EmbedBuilder().setTitle('Test').setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;
