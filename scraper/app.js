var logger = require('../common/logger.js');
var redisManager = require('./redisManager.js');

logger.info('scraper app init');

redisManager.initialise();

