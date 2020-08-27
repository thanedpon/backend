'use strict';

const LOG_LEVEL = process.env.LOG_LEVEL /* istanbul ignore next */ || 'debug';
const pino = require('pino');

module.exports = ( /* istanbul ignore next */options = {
}) => {
  return pino({
    name: options.name,
    level: options.level/* istanbul ignore next */
      ? options.level
      : LOG_LEVEL,
    timestamp: options.timestamp?options.timestamp: false,
    base: {

    },
    prettyPrint: {
      translateTime: options.translateTime?options.translateTime: false,
      colorize: false,
    },
  });
};

