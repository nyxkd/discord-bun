import {
    Colors,
    EmbedBuilder,
    SlashCommandBuilder,
    bold,
    italic
} from 'discord.js';

import type { ChatInputCommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong! Returns the latency of the bot in ms!'),
    execute: async (interaction) => {
        const message = await interaction.reply({
            content: italic('Pinging...'),
            fetchReply: true
        });

        const embed = new EmbedBuilder()
            .addFields([
                {
                    name: ':sparkling_heart: WS Latency',
                    value: `${bold(interaction.client.ws.ping.toString())}ms`
                },
                {
                    name: ':round_pushpin: Rountrip Latency',
                    value: `${bold((message.createdTimestamp - interaction.createdTimestamp).toString())}ms`
                }
            ])
            .setColor(Colors.Green)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.editReply({
            content: italic('Here are the results!'),
            embeds: [embed]
        });
    }
};

export default command;
