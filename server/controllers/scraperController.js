var logger = require('../../common/logger.js');
var serverPublish = require('../redis/serverPublish.js');

exports.scrapeStartCallback = function(req, res){
    logger.info('scraperController: scrapeStartCallback');
    serverPublish.sendMessage(serverPublish.serverOperations.startScraper);
    res.redirect('/');
};

exports.scrapeStopCallback = function(req, res){
    logger.info('scraperController: scrapeStopCallback');
    serverPublish.sendMessage(serverPublish.serverOperations.stopScraper);
    res.redirect('/');
};

exports.scrapeQuitCallback = function(req, res) {
    logger.info('scraperController: scrapeQuitCallback');
    serverPublish.sendMessage(serverPublish.serverOperations.quitScraper);
    res.redirect('/');
};