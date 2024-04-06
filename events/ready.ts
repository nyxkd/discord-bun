import { Events } from 'discord.js';

import type { Event } from '../globals';

const readyEvent: Event<Events.ClientReady> = {
    once: true,
    execute: async (client) => {
        client.logger.log('silly', `Logged in as ${client.user?.tag}!`);
    }
}

export default readyEvent;