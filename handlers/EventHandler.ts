import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

class EventHandler {
    client;

    constructor(client) {
        this.client = client;
    }

    public async initialize() {
        const eventsPath = join(__dirname, '..', 'events');
        const eventFiles = (await readdir(eventsPath)).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
        const t0 = Date.now();

        for (const file of eventFiles) {
            const event = await import(join(eventsPath, file));
            const eventName = file.split('.')[0];

            if (event.default.once) {
                this.client.once(eventName, (...args) => event.default.execute(this.client, ...args));
            } else {
                this.client.on(eventName, (...args) => event.default.execute(this.client, ...args));
            }

            this.client.events.set(eventName, event.default);
            this.client.logger.log('eventHandler', `Loaded event: ${eventName}`);
        }

        this.client.logger.log('eventHandler', `Loaded ${eventFiles.length} events. (${Date.now() - t0}ms)`);
    }
}

export default EventHandler;
