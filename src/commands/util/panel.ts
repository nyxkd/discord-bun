import {
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
    PermissionFlagsBits,
    type ChatInputCommandInteraction
} from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('See some information about the bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction) => {
        const current_servers = interaction.guild?.client.guilds.cache.size;
        const current_users = interaction.guild?.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Current servers', value: current_servers.toString() },
                { name: 'Current users', value: current_users.toString() }
            )
            .setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;
