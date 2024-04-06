import { BaseInteraction } from 'discord.js';
import { EmbedBuilder, Colors, Events } from "discord.js";

import type { Event } from '../globals';

const interactionCreateEvent: Event<Events.InteractionCreate> = {
    once: false,
    async execute(client, interaction: BaseInteraction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

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
}

export default interactionCreateEvent;