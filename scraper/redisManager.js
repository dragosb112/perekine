var redis = require('redis');
var appManager = require('./appManager.js');
var logger = require('../common/logger.js');
var serverOperations = require('../common/serverOperations.js');

var channelName = 'server';
var subscriber = null;

function initialise() {
    logger.info('redisManager: initialise');
    subscriber = redis.createClient();
    logger.info('redisManager: created subscriber client');
    subscriber.on('message', function (channel, message) {
        logger.info('redisManager: message received: ' + message);
        var header = null;
        var body = null;
        if (message) {
            header = message.split(/ (.+)/)[0];
            body = message.split(/ (.+)/)[1];
        }
        if (channel === channelName) {
            switch (header) {
                case serverOperations.startScraper:
                    appManager.startScraping();
                    break;
                case serverOperations.stopScraper:
                    appManager.stopScraping();
                    break;
                case serverOperations.resumeScraper:
                    appManager.resumeScraping();
                    break;
                case serverOperations.quitScraper:
                    appManager.quitApp();
                    break;
                case serverOperations.setScraperQuery:
                    if (body) {
                        appManager.setScraperQuery(body);
                    }

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