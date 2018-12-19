const pino = require("pino");
const logger = pino({
  prettyPrint: { colorize: true }
});

exports.default = logger;
