/**
 * Singleton class to handle app management
 * TODO: research proper way to implement singletons
 */
var logger = require('../common/logger');
var Scraper = require('./scraperInstance');

var singletonInstanced = false;

var AppManager = function () {
    if (!(this instanceof AppManager)) {
        return new AppManager();
    }

    if (singletonInstanced === false) {
        singletonInstanced = true;
    } else {
        logger.info('appManager instance already running. Cannot create another one');
        return;
    }

    var self = this;
    this.scraperInstanceList = {};

    logger.info('appManager singleton initialised');

    AppManager.prototype.initialise = function () {

    };

    AppManager.prototype.startScraper = function(instanceId) {
        if(instanceId){
            var scraper = self.scraperInstanceList[instanceId];
            if(scraper){
                scraper.start();
            }    
        }
    };

    AppManager.prototype.stopScraper = function(instanceId) {
        if(instanceId){
            var scraper = self.scraperInstanceList[instanceId];
            if(scraper){
                scraper.stop();
            }    
        }    
    };

    AppManager.prototype.pauseScraper = function(instanceId) {
        if(instanceId){
            var scraper = self.scraperInstanceList[instanceId];
            if(scraper){
                scraper.pause();
            }    
        }
    };

    AppManager.prototype.createScraper = function(config, instanceId) {
        var newScraper = new Scraper(config, instanceId);
        if(newScraper){
            self.scraperInstanceList[instanceId] = newScraper;
        } 
    };

    AppManager.prototype.setScraperQuery = function(instanceId, queryString){
        if(instanceId && queryString){
            var scraper = self.scraperInstanceList[instanceId];
            if(scraper){
                scraper.setScraperQuery(queryString);
            }    
        }
    };

};

module.exports = AppManager;