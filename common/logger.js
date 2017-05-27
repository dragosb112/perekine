var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug'
        }),
        new (winston.transports.File)({
            name: 'debug-log',
            filename: './output/logs/debug.log',
            level: 'debug'
        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: './output/logs/error.log',
            level: 'error'
        }),
    ]
});

function info(message){
    logger.info(message);
}

function debug(message){
    logger.debug(message);
}

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
