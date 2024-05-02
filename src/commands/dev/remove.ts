import { SlashCommandBuilder, EmbedBuilder, Colors, type ChatInputCommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a global command')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('The name of the command you want to remove')
                .setAutocomplete(true)
                .setRequired(true)
        ),
    isDevOnly: true,
    autocomplete: async (interaction) => {
        const command = interaction.options.getString('name');

        const commands = await interaction.client.APIClient.getGlobalCommands(interaction.client.config.applicationID);

        const filtered = commands.filter((c) => c.name.startsWith(command));

        const choices = filtered.map((c) => {
            return {
                name: c.name,
                value: c.name
            };
        });

        await interaction.respond(choices);
    },
    execute: async (interaction) => {
        const command = interaction.options.getString('command');

        const currentComands = await interaction.client.APIClient.getGlobalCommands(
            interaction.client.config.applicationID
        );

        const commandToRemove = currentComands.find((c) => c.name === command);

        if (!commandToRemove) {
            const embed = new EmbedBuilder().setTitle(`Command ${command} not found`).setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed]
            });
            return;
        }

        await interaction.client.application.commands.delete(commandToRemove.id).then(async () => {
            const embed = new EmbedBuilder()
                .setTitle(`Successfully removed the command ${command}`)
                .setColor(Colors.Green);

            await interaction.reply({
                embeds: [embed]
            });
        });
    }
};

export default command;
