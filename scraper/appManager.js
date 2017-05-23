var logger = require('./utilities/logger.js');
var scraper = require('./scraper.js');

function startScraping(){
    logger.info('appManager: startScraping');
    scraper.setIsRunning(true);
    scraper.scrapeTwitter();
    
}

function stopScraping(){
    logger.info('appManager: stopScraping');
    scraper.setIsRunning(false);
}

function resumeScraping(){
    logger.info('appManager: resumeScraping');
}

function quitApp(){
    logger.info('appManager: quitApp');
    process.exit(1);
}

module.exports = {
    startScraping: startScraping,
    stopScraping: stopScraping,
    resumeScraping: resumeScraping,
    quitApp: quitApp
};