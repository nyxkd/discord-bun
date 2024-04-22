import { Events } from 'discord.js';

import type { Event } from '../../globals';

const event: Event<Events.Error> = {
    once: true,
    async execute(client, error) {
        client.logger.log('error', `An error has occured: ${error}`);
    }
};

export default event;
