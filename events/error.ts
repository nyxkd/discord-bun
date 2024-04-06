import { Events } from 'discord.js';

import type { Event } from '../globals';

const errorEvent: Event<Events.Error> = {
    once: true,
    async execute(client, error) {
        client.logger.log('error', `An error has occured: ${error}`);
    }
}

export default errorEvent;