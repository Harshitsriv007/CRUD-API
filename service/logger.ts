import {createLogger,format,transports} from 'winston';

// Configure the Winston logger
const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({ filename: './log/error.log', level: 'error' }), // Log errors to error.log
        // new winston.transports.File({ filename: './log/app.log' }) // Log all other logs to combined.log
    ]
});

export default logger;
