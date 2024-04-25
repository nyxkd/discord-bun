import { Events } from 'discord.js';

import type { Event } from '../globals';

const event: Event<Events.ClientReady> = {
    once: true,
    execute: async (client) => {
        client.logger.log('event', `Logged in as ${client.user?.tag}!`);
    }
};

export default event;
