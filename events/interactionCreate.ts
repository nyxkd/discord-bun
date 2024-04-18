import { BaseInteraction } from 'discord.js';
import { EmbedBuilder, Colors, Events } from 'discord.js';

import type { Event } from '../globals';

const event: Event<Events.InteractionCreate> = {
    once: false,
    async execute(client, interaction: BaseInteraction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            if (command.isDevOnly && !client.config.devIDs.includes(interaction.user.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('You do not have permission to use this command!')
                    .setColor(Colors.Red);

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

                return;
            }

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
