import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { Premium } from '../schemas/Premium';

class Database {
    public db: Sequelize;
    public client;

    constructor(client) {
        this.client = client;
    }

    public async initialize() {
        this.db = new Sequelize({
            dialect: PostgresDialect,
            database: this.client.config.database.name,
            user: this.client.config.database.user,
            password: this.client.config.database.password,
            host: this.client.config.database.host,
            port: this.client.config.database.port,
            models: [Premium],
            define: {
                freezeTableName: true
            }
        });

        await this.db
            .authenticate()
            .then(async () => {
                await this.db.sync();

                this.client.logger.log('event', 'Connected to the database.');
            })
            .catch((error) => {
                this.client.logger.log('error', `Failed to connect to the database: ${error}`);
                process.exit(1);
            });
    }
}

export default Database;
