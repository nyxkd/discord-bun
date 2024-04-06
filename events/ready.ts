import type { Event } from "../types";

const event: Event = {
    once: true,
    async execute(client) {
        client.logger.log('event', 'Ready!')
    }
}

export default event;