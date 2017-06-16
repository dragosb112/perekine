var logger = require('../common/logger.js');
var redisManager = require('./redisManager.js');

// //testing stuff
// var AppManager = require('./appManager2');
// var config = require('./twitter/config');
// var appManager = new AppManager();
// appManager.createScraper(config, '1111');
// appManager.createScraper(config, '2222');
// appManager.startScraper('1111');

logger.info('### SCRAPER PROCESS INIT ###');

redisManager.initialise();

