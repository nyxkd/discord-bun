import {
    Colors,
    EmbedBuilder,
    SlashCommandBuilder,
    bold,
    codeBlock,
    type ChatInputCommandInteraction
} from 'discord.js';
import { Premium } from '../../schemas/Premium';

const generateCode = async () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('Generates a new premium code')
        .addNumberOption((option) =>
            option
                .setName('quantity')
                .setDescription('The amount of codes to generate')
                .setMinValue(1)
                .setMaxValue(5)
                .setRequired(false)
        ),
    isDevOnly: true,
    execute: async (interaction) => {
        const quantity = interaction.options.getNumber('quantity', false);

        if (quantity) {
            const codes = [];

            for (let i = 0; i < quantity; i++) {
                const code = await generateCode();
                codes.push(code);
            }

            try {
                await Premium.bulkCreate(codes.map((code) => ({ code })));

                await interaction.reply({
                    content: `Successfully generated ${quantity} premium codes!` + codeBlock('yaml', codes.join('\n')),
                    ephemeral: true
                });

                return;
            } catch (error) {
                interaction.client.logger.log('error', `Failed to create a premium code: ${error}`);

                await interaction.reply({
                    content: 'Failed to create a premium code!',
                    ephemeral: true
                });

                return;
            }
        }

        const code = await generateCode();
        try {
            await Premium.create({
                code
            });
        } catch (error) {
            interaction.client.logger.log('error', `Failed to create a premium code: ${error}`);

            await interaction.reply({
                content: 'Failed to create a premium code!',
                ephemeral: true
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Premium Code Generated!')
            .setDescription(`Here is your premium code: ${bold(code)}`)
            .setColor(Colors.Green)
            .setFooter({
                text: `Generated by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

export default command;