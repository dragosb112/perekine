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

var channelName = 'server';
var subscriber = null;
var appManager2 = null;
/**
 * initialise redis subscriber to server channel
 */
function initialise() {
    appManager = new AppManager();
    appManager.initialise();
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
                    if(body){
                        appManager.startScraper(body);
                    }        
                    break;
                case serverOperations.stopScraper:
                    if(body){
                        appManager.stopScraper(body);
                    }
                    
                    break;
                case serverOperations.pauseScraper:
                    if(body){
                        appManager.pauseScraper(body);
                    }                 
                    break;
                case serverOperations.quitScraper:
                    appManager.quitApp();
                    break;
                case serverOperations.setScraperQuery:
                    logger.error('setScraperQuery - redis functionality not implemented');
                    if (body) {
                        //appManager.setScraperQuery(body);
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