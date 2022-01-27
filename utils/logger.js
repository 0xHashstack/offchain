const { createLogger, format, transports } = require('winston');

const filter = (level) => format((info) => {
    if (info.level === level) {
      return info;
    }
  })();

module.exports = createLogger({
    transports:
    [new transports.File({
        filename: './logs/Open_offchain.log',
        format:format.combine(
            format.splat(),
            format.timestamp({format: 'DD-MMM-YYYY HH:mm:ss'}),
            format.align(),
            format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )}),
        new transports.File({
            filename: './logs/http.log',
            level:"http",
            format:format.combine(
                filter("http"),
                format.simple()
        )}),
        new transports.Console({
            level: "debug",
            format: format.combine(
              filter("debug"),
              format.splat(),
              format.colorize(),
              format.timestamp(),
              format.simple()
            )
          }),
    ],
    exitOnError: false

});