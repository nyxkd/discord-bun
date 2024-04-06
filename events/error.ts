import type { Event } from "../types";

const event: Event = {
    once: true,
    async execute(client, error) {
        client.logger.log('error', `An error has occured: ${error}`);
    }
}

export default event;