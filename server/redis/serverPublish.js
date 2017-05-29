var redis = require('redis');
var logger = require('../../common/logger.js');
var channelName = 'server';

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
};