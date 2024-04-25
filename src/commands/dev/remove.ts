import { SlashCommandBuilder, EmbedBuilder, Colors, type ChatInputCommandInteraction } from 'discord.js';

const command: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a global command')
        .addStringOption((option) =>
            option.setName('command').setDescription('The command to remove').setRequired(true)
        ),
    isDevOnly: true,
    execute: async (interaction) => {
        const command = interaction.options.getString('command', true);

        const currentComands = await interaction.client.application?.commands.fetch();
        const commandToRemove = currentComands.find((c) => c.name === command);

        if (!commandToRemove) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Command ${command} not found`)
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed]
            });
            return;
        }

        try {
            await interaction.client.application?.commands.delete(commandToRemove.id);

            const embed = new EmbedBuilder()
                .setTitle('Removed command')
                .setDescription(`Successfully removed the command ${command}`)
                .setColor(Colors.Green);

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Failed to remove the command ${command}`)
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed]
            });
        }
    }
};

export default command;
