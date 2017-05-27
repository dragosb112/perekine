var redis = require('redis');
var appManager = require('./appManager.js');
var logger = require('./utilities/logger.js');

var channelName = 'server';
var subscriber = null; 

function initialise() {
    logger.info('redisManager: initialise');
    subscriber = redis.createClient();
    logger.info('redisManager: created subscriber client');
    subscriber.on('message', function (channel, message) {
        logger.info('redisManager: message received: ' + message);
        if (channel === channelName) {
            switch (message) {
                case '1':
                    appManager.startScraping();
                    break;
                case '2':
                    appManager.stopScraping();
                    break;
                case '3':
                    appManager.resumeScraping();
                    break;
                case '4':
                    appManager.quitApp();
                    break;
            }
        }
    });
    subscriber.subscribe(channelName);
    logger.info('redisManager: subscribed to ' + channelName);
}

module.exports = {
    initialise: initialise,
};