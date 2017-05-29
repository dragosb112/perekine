var logger = require('../../common/logger.js');
var serverOperations = require('../../common/serverOperations.js');
var serverPublish = require('../redis/serverPublish.js');

exports.scrapeStartCallback = function(req, res){
    logger.info('scraperController: scrapeStartCallback');
    serverPublish.sendMessage(serverOperations.startScraper);
    res.redirect('/');
};

exports.scrapeStopCallback = function(req, res){
    logger.info('scraperController: scrapeStopCallback');
    serverPublish.sendMessage(serverOperations.stopScraper);
    res.redirect('/');
};

exports.scrapeQuitCallback = function(req, res) {
    logger.info('scraperController: scrapeQuitCallback');
    serverPublish.sendMessage(serverOperations.quitScraper);
    res.redirect('/');
};

exports.scrapeSetQuery = function(req, res){
    logger.info('scraperController: scrapeSetQuery');
    if(req.query.scrapeQuery != null){
        var message = serverOperations.setScraperQuery + ' ' + req.query.scrapeQuery;
        serverPublish.sendMessage(message);
    }
    res.redirect('/');
};