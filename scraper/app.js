var logger = require('./utilities/logger.js');
var redisManager = require('./redisManager.js');

logger.info('scraper app init');

redisManager.initialise();

