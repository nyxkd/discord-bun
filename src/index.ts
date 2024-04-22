import CustomClient from './structures/CustomClient';
import config from '../config.json';

new CustomClient({
    token: Bun.env['TOKEN'] as string,
    applicationID: config.applicationID as string,
    devIDs: config.devIDs as string[],
    testGuildID: config.testGuildID as string,
    premiumRoleID: config.premiumRoleID as string,
    database: {
        name: Bun.env['DB_NAME'] as string,
        user: Bun.env['DB_USER'] as string,
        password: Bun.env['DB_PASS'] as string,
        host: Bun.env['DB_HOST'] as string,
        port: parseInt(Bun.env['DB_PORT'])
    }
});
