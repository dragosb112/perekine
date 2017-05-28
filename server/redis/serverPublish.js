var redis = require('redis');
var logger = require('../../common/logger.js');
var channelName = 'server';
var serverOperations = {
    startScraper: '1',
    stopScraper: '2',
    resumeScraper: '3',
    quitScraper: '4',
    setScraperQuery: '5'
};
var publisher = null;

function initialise() {
    logger.info('redisManager: initialise');
    publisher = redis.createClient();
    logger.info('redisManager: created publisher client');
}

function sendMessage(operation) {
    if (operation) {
        logger.info('redisManager published on: ' + channelName + ', ' + operation);
        publisher.publish(channelName, operation);
    }
}

module.exports = {
    initialise: initialise,
    sendMessage: sendMessage,
    serverOperations: serverOperations
};