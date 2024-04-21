import { Colors, EmbedBuilder, SlashCommandBuilder, italic, type ChatInputCommandInteraction } from 'discord.js';
import { Premium } from '../../schemas/Premium';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('redeem')
        .setDescription('Redeem a premium code')
        .addStringOption((option) => option.setName('code').setDescription('The code to redeem').setRequired(true)),
    isDevOnly: false,
    execute: async (interaction) => {
        const PREMIUM_ROLE_ID = interaction.client.config.premiumRoleID;
        const member = await interaction.guild!.members.fetch(interaction.user.id);

        if (member.roles.cache.has(PREMIUM_ROLE_ID)) {
            await interaction.reply({
                content: 'You already have the premium role!',
                ephemeral: true
            });

            return;
        }

        const code = interaction.options.getString('code', true);

        const doesCodeExist = await Premium.findOne({
            where: {
                code
            }
        });

        if (!doesCodeExist) {
            await interaction.reply({
                content: 'The code you provided does not exist!',
                ephemeral: true
            });

            return;
        }

        await member.roles
            .add(PREMIUM_ROLE_ID)
            .then(async () => {
                const embed = new EmbedBuilder()
                    .setTitle(italic(`You have successfully redeemed the premium code!`))
                    .setColor(Colors.Yellow)
                    .setFooter({
                        text: `Redeemed by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed]
                });
            })
            .catch((error) => {
                interaction.client.logger.log(
                    'error',
                    `Failed to add the premium role to ${interaction.user.tag}: ${error}`
                );

                if (error.message === 'Missing Permissions') {
                    return interaction.reply({
                        content: 'I do not have the required permissions to add the premium role to you!',
                        ephemeral: true
                    });
                }

                return interaction.reply({
                    content: 'An error has occurred while trying to redeem the code!',
                    ephemeral: true
                });
            })
            .finally(async () => {
                doesCodeExist.destroy();
            });
    }
};

export default command;
