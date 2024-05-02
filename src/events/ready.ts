import { Events } from 'discord.js';

const event: ClientEvent<Events.ClientReady> = {
    once: true,
    execute: async (client) => {
        client.logger.log('event', `Logged in as ${client.user?.tag}!`);
    }
};

export default event;
