/**
 * Logging system using winston library
 */

var winston = require('winston');
var processArgs = require('./processArgs.js');

var outputPath = processArgs.outputPath; 

/**
 * configure winston
 * console: only debug
 * file: debug and error
 */
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug'
        }),
        new (winston.transports.File)({
            name: 'debug-log',
            filename: outputPath + '/logs/debug.log',
            level: 'debug'
        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: outputPath + '/logs/error.log',
            level: 'error'
        }),
    ]
});

/**
 * log info
 * @param {string} message 
 */
function info(message){
    logger.info(message);
}

/**
 * log debug
 * @param {string} message 
 */
function debug(message){
    logger.debug(message);
}

/**
 * log error
 * @param {string} message 
 * @param {err params} params 
 */
function error(message, params){
    if(params === null){
        logger.error(message);
    } else {
        logger.error(message, params);
    }
}

module.exports = {
    debug: debug,
    info: info,
    error: error,
}

