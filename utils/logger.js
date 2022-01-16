const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
transports:
    new transports.File({
    filename: 'logs/Open_offchain.log',
    format:format.combine(
        format.splat(),
        format.timestamp({format: 'DD-MMM-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
});