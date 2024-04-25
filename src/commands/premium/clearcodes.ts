import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Premium } from '../../schemas/Premium';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('clearcodes')
        .setDescription('Nuke all the premium codes from the database.'),
    isDevOnly: true,
    execute: async (interaction) => {
        const codes_count = await Premium.count();

        await Premium.destroy({
            where: {}
        }).then(() => {
            const embed = new EmbedBuilder()
                .setTitle(`Successfully nuked ${codes_count} premium codes from the database!`)
                .setTimestamp();

            interaction.reply({
                embeds: [embed]
            });
        });
    }
};

export default command;
