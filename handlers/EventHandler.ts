import { join } from "node:path";
import { readdir } from "node:fs/promises";

import type CustomClient from "../structures/CustomClient";
import type { Event } from "../types";

class EventHandler {
    client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    public async initialize() {
        const eventsPath = join(__dirname, "..", "events");
        const eventFiles = (await readdir(eventsPath)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        const t0 = Date.now();

        if (eventFiles.length === 0) {
            this.client.logger.log('eventHandler', 'No events found.');
            return;
        };


        for (const file of eventFiles) {
            const event: Event = (await import(join(eventsPath, file))).default;
            const eventName = file.split('.')[0];


            if (event.once) {
                this.client.once(eventName, (...args) => event.execute(this.client, ...args));
            } else {
                this.client.on(eventName, (...args) => event.execute(this.client, ...args));
            }

            this.client.events.set(eventName, event);
            this.client.logger.log('eventHandler', `Loaded event: ${eventName}`);

        }

        const t1 = Date.now();

        this.client.logger.log('silly', `Loaded ${eventFiles.length} events in ${t1 - t0}ms.`);
    }
}

export default EventHandler;