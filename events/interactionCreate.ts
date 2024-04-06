import type { Event } from "../types";
import { EmbedBuilder, Colors } from "discord.js";

const event: Event = {
    once: false,
    async execute(client, interaction) {
        const command = client.commands.get(interaction.commandName);

        if (!client.commands.has(interaction.commandName)) {
            const embed = new EmbedBuilder()
                .setTitle('This command exists in the files but has been not registered!')
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        };


        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error: any) {
            client.logger.log('error', `An error has occured while executing ${interaction}: ${error}`);

            const embed = new EmbedBuilder()
                .setTitle('There was an error while executing this command!')
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};

export default event;