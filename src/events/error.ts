import { Events } from 'discord.js';

const event: ClientEvent<Events.Error> = {
    once: true,
    async execute(client, error: Error) {
        client.logger.log('error', `An error has occured: ${error}`);
    }
};

export default event;
