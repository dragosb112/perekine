/**
 * Redis server subscriber manager
 * Subscirbes to server channel and redirects 
 * messages through the process
 */

var redis = require('redis');
var AppManager = require('./appManager');
var logger = require('../common/logger.js');
var serverOperations = require('../common/serverOperations.js');
var config = require('./twitter/config');
var ServerMessageProcessor = require('./serverMessageProcessor');

var channelName = 'server';
var subscriber = null;
var appManager2 = null;
var serverMessageProcessor = null;
/**
 * initialise redis subscriber to server channel
 */
function initialise() {
    appManager = new AppManager();
    appManager.initialise();
    serverMessageProcessor = new ServerMessageProcessor();
    serverMessageProcessor.initialise();
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
            var messageProcessed = serverMessageProcessor.process(message);
        }
        if (channel === channelName && messageProcessed) {
            switch (messageProcessed.messageType) {
                case serverOperations.startScraper:
                    if(messageProcessed.scraperId){
                        appManager.startScraper(messageProcessed.scraperId);
                    }        
                    break;
                case serverOperations.stopScraper:
                    if(messageProcessed.scraperId){
                        appManager.stopScraper(messageProcessed.scraperId);
                    }
                    
                    break;
                case serverOperations.pauseScraper:
                    if(messageProcessed.scraperId){
                        appManager.pauseScraper(messageProcessed.scraperId);
                    }                 
                    break;
                case serverOperations.quitScraper:
                    appManager.quitApp();
                    break;
                case serverOperations.setScraperQuery:
                    //logger.error('setScraperQuery - redis functionality not implemented');
                    if (messageProcessed.scraperId && messageProcessed.messageBody) {
                        appManager.setScraperQuery(messageProcessed.scraperId, messageProcessed.messageBody);
                    }
                    break;
                case serverOperations.createScraperInstance:
                    if (body) {
                        var scraperInstanceId = body;
                        appManager.createScraper(config, scraperInstanceId);
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