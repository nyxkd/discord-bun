import winston from 'winston';

const Logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        debug: 2,
        event: 3,
        silly: 4,
        rest: 5,
        commandHandler: 6,
        eventHandler: 7,
        custom: 8
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'DD-MM-YYYY HH:mm:ss'
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}] ${message}`;
                })
            )
        })
    ],
    level: 'custom'
});

winston.addColors({
    error: 'red bold',
    warn: 'yellow bold italic',
    debug: 'blue bold italic',
    event: 'green bold',
    silly: 'magenta bold italic',
    rest: 'cyan bold',
    commandHandler: 'yellow italic',
    eventHandler: 'green italic',
    custom: 'cyan bold'
});

export default Logger;
