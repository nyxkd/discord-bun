import CustomClient from './structures/CustomClient';
import config from './config.json'

new CustomClient({
    token: Bun.env['TOKEN'] as string,
    devIDs: config.devIDs as string[],
    testGuildID: config.testGuildID as string,
    isDevelopmentENV: Bun.env.NODE_ENV === 'development'
});