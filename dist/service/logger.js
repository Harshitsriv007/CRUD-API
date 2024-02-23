"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Configure the Winston logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.json(),
    transports: [
        new winston_1.transports.File({ filename: './log/error.log', level: 'error' }), // Log errors to error.log
        // new winston.transports.File({ filename: './log/app.log' }) // Log all other logs to combined.log
    ]
});
// If we're not in production, log to the console as well
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }
exports.default = logger;
