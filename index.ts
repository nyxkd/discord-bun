import CustomClient from './structures/CustomClient';

const NODE_ENV = Bun.env.NODE_ENV;
new CustomClient({
    token: Bun.env['TOKEN'] as string,
    devIDs: [
        '793880467270008832' // @8xu
    ],
    testGuildID: '1224340718299123732',
    isDevelopmentENV: NODE_ENV === 'development'
});