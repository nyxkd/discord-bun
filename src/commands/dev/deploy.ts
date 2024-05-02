import {
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
    type ChatInputCommandInteraction,
    CommandInteraction
} from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploy a global command')
        .addStringOption((option) =>
            option.setName('name').setDescription('The name of the command').setAutocomplete(true).setRequired(true)
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
        const name = interaction.options.getString('name', true);

        const commandToDeploy = interaction.client.testGuildCommands.get(name) as Command<CommandInteraction>;

        if (!command) {
            const embed = new EmbedBuilder().setTitle(`Command ${command} does not exist`).setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            return;
        }

        await interaction.client.APIClient.createGlobalCommand(
            interaction.client.config.applicationID,
            commandToDeploy.data.toJSON()
        );

        const embed = new EmbedBuilder()
            .setTitle(`Succesfully deployed command ${commandToDeploy.data.name}`)
            .setColor(Colors.Green);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

export default command;
