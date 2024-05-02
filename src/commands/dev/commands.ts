import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Do something with commands!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('List all commands')
                .addStringOption((option) =>
                    option.setName('kind').setDescription('The kind of commands to list').setRequired(true).addChoices(
                        {
                            name: 'global',
                            value: 'global'
                        },
                        {
                            name: 'guild',
                            value: 'guild'
                        }
                    )
                )
        ),
    isDevOnly: true,
    autocomplete: async (interaction) => {
        const command = interaction.options.getString('name');

        const commands = interaction.client.testGuildCommands;

        const filtered = commands.filter((c) => c.data.name.startsWith(command));

        const choices = filtered.map((c) => {
            return {
                name: c.data.name,
                value: c.data.name
            };
        });

        await interaction.respond(choices);
    },
    execute: async (interaction) => {
        const subcommand = interaction.options.getSubcommand(true);

        if (subcommand === 'list') {
            const kind = interaction.options.getString('kind');

            if (kind === 'global') {
                const currentCommands = await interaction.client.application?.commands.fetch();

                const embed = new EmbedBuilder().setTitle(`Current global commands`).addFields(
                    currentCommands.map((command) => {
                        return {
                            name: command.name,
                            value: command.description
                        };
                    })
                );

                await interaction.reply({
                    embeds: [embed]
                });
            }

            if (kind === 'guild') {
                const currentCommands = await interaction.guild?.commands.fetch();

                const embed = new EmbedBuilder().setTitle(`Current guild commands`).addFields(
                    currentCommands.map((command) => {
                        return {
                            name: command.name,
                            value: command.description
                        };
                    })
                );

                await interaction.reply({
                    embeds: [embed]
                });
            }
        }
    }
};

export default command;
