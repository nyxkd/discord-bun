import { Events } from 'discord.js';

import { type Event } from '../globals.d';

const event: Event<Events.Error> = {
    once: true,
    async execute(client, error: Error) {
        client.logger.log('error', `An error has occured: ${error}`);
    }
};

export default event;
