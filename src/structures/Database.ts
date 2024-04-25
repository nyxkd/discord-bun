import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { Premium } from '../schemas/Premium';
import { Hash } from '../schemas/Hash';

class Database {
    public database: Sequelize;
    public client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    public async initialize() {
        this.database = new Sequelize({
            dialect: PostgresDialect,
            database: this.client.config.database.name,
            user: this.client.config.database.user,
            password: this.client.config.database.password,
            host: this.client.config.database.host,
            port: this.client.config.database.port,
            models: [Premium, Hash],
            define: {
                freezeTableName: true
            }
        });

        await this.database
            .authenticate()
            .then(async () => {
                await this.database.sync();

                this.client.logger.log('event', 'Connected to the database.');
            })
            .catch((error: Error) => {
                this.client.logger.log('error', `Failed to connect to the database: ${error}`);
                process.exit(1);
            });
    }
}

export default Database;
