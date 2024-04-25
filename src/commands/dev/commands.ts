import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction, CommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('Do something with commands!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('deploy')
                .setDescription('Deploy a global command')
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('The name of the command')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('List all commands')
                .addStringOption((option) =>
                    option.setName('kind').setDescription('The kind of commands to list').addChoices(
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
        const commands = interaction.client.testGuildCommands.map((command: Command<CommandInteraction>) => {
            return {
                command: command.data.name
            };
        });

        const command = interaction.options.getString('name', true);

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
        const subcommand = interaction.options.getSubcommand(true);

        if (subcommand === 'list') {
            const kind = interaction.options.getString('kind', false);

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

        if (subcommand === 'deploy') {
            const name = interaction.options.getString('name', true);

            const commandToDeploy = interaction.client.testGuildCommands.get(name) as Command<CommandInteraction>;

            if (!command) {
                await interaction.reply({
                    content: 'Command not found!',
                    ephemeral: true
                });

                return;
            }

            await interaction.client.APIClient.createGlobalCommand(
                interaction.client.config.applicationID,
                commandToDeploy.data.toJSON()
            );

            await interaction.reply({
                content: 'Command deployed!',
                ephemeral: true
            });
        }
    }
};

export default command;
