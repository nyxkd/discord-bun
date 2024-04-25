import { AutocompleteInteraction, type BaseInteraction, CommandInteraction } from 'discord.js';
import { EmbedBuilder, Colors, Events } from 'discord.js';

import { type Event } from '../globals.d';

const event: Event<Events.InteractionCreate> = {
    once: false,
    async execute(client, interaction: BaseInteraction) {
        if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

        if (interaction.isCommand()) {
            const command = (client.testGuildCommands.get(interaction.commandName) ||
                client.commands.get(interaction.commandName)) as Command<CommandInteraction>;

            if (!command) return;

            try {
                if (command.isDevOnly && !client.config.devIDs.includes(interaction.user.id)) {
                    const embed = new EmbedBuilder()
                        .setTitle('You do not have permission to use this command!')
                        .setColor(Colors.DarkRed);

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });

                    return;
                }

                await command.execute(interaction);
            } catch (error) {
                client.logger.log('error', `An error has occured while executing ${interaction}: ${error}`);

                const embed = new EmbedBuilder()
                    .setTitle('There was an error while executing this command!')
                    .setColor(Colors.Red);

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        } else if (interaction.isAutocomplete()) {
            const command = (client.testGuildCommands.get(interaction.commandName) ||
                client.commands.get(interaction.commandName)) as Command<AutocompleteInteraction>;
            if (!command) return;

            if (command.autocomplete) {
                await command.autocomplete(interaction);
            }

            return;
        }
    }
};

export default event;
