import {
    ChatInputCommandInteraction,
    type GuildTextBasedChannel,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder
} from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDMPermission(false)
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The number of messages to remove.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDescription('Purges messages from the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        if (!interaction.channel?.isTextBased) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(
                    'This command can only be used in text channels.'
                );

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        const amount = interaction.options.getInteger('amount', true);
        const channel = interaction.channel as GuildTextBasedChannel;

        await channel.bulkDelete(amount, true);

        const embed = new EmbedBuilder()
            .setTitle(`Purged **${amount}** message${amount === 1 ? '' : 's'}.`)

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;
