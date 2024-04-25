import { SlashCommandBuilder, EmbedBuilder, Colors, type ChatInputCommandInteraction, codeBlock } from 'discord.js';

import { Hash } from '../../schemas/Hash';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('hash')
        .setDescription('Interrogate the database to read the hash of a command')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('The command to read the hash of')
                .setAutocomplete(true)
                .setRequired(true)
        ),
    isDevOnly: true,
    autocomplete: async (interaction) => {
        const commands = await Hash.findAll({
            attributes: ['command']
        });

        const command = interaction.options.getString('command', true);

        const filteredCommands = commands.filter((cmd) => cmd.command.startsWith(command));

        const choices = filteredCommands.map((cmd) => {
            return {
                name: cmd.command,
                value: cmd.command
            };
        });

        await interaction.respond(choices);
    },
    execute: async (interaction) => {
        const command = interaction.options.getString('command', true);

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
