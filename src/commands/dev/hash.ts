import { SlashCommandBuilder, EmbedBuilder, Colors, type ChatInputCommandInteraction, codeBlock } from 'discord.js';

import { Hash } from '../../schemas/Hash';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('hash')
        .setDescription('Interrogate the database to read the hash of a command')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('The name of the command to read the hash of')
                .setAutocomplete(true)
                .setRequired(true)
        ),
    isDevOnly: true,
    autocomplete: async (interaction) => {
        const command = interaction.options.getString('command');

        const hashes = await Hash.findAll({
            attributes: ['command']
        });

        const filtered = hashes.filter((c) => c.command.startsWith(command));

        const choices = filtered.map((c) => {
            return {
                name: c.command,
                value: c.command
            };
        });

        await interaction.respond(choices);
    },
    execute: async (interaction) => {
        const command = interaction.options.getString('name');

        const hash = await Hash.findOne({
            where: {
                command
            }
        });

        if (!hash) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Command ${command} not found`)
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed]
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Hash for command ${command}`)
            .setDescription(codeBlock(hash.hash))
            .addFields([
                {
                    name: 'Created at',
                    value: hash.createdAt.toUTCString(),
                    inline: true
                },
                {
                    name: 'Updated at',
                    value: hash.updatedAt.toUTCString(),
                    inline: true
                }
            ])
            .setColor(Colors.Blurple);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

export default command;
