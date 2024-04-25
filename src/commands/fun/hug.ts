import { SlashCommandBuilder, EmbedBuilder, Colors, type ChatInputCommandInteraction, italic } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone')
        .addUserOption((option) => option.setName('user').setDescription('The user you want to hug').setRequired(true)),
    execute: async (interaction) => {
        const user = interaction.options.getUser('user');

        if (user === interaction.user) {
            const embed = new EmbedBuilder().setTitle(italic(`You cannot hug yourself...`)).setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(`${interaction.user} hugged ${user}!`)
            .setImage('https://c.tenor.com/JKo6Z5x3slYAAAAC/tenor.gif')
            .setColor(Colors.White);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default command;
