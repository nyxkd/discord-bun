import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Premium } from '../../schemas/Premium';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder().setName('clearcodes').setDescription('Purges messages from the channel.'),
    isDevOnly: true,
    execute: async (interaction) => {
        const codes_count = await Premium.count();

        await Premium.destroy({
            where: {}
        }).then(() => {
            const embed = new EmbedBuilder().setTitle(
                `Successfully purged ${codes_count} premium codes from the database!`
            );

            interaction.reply({
                embeds: [embed]
            });
        });
    }
};

export default command;
