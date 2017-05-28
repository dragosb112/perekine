var logger = require('../common/logger.js');
var scraper = require('./scraper.js');

function startScraping() {
    logger.info('appManager: startScraping');
    var currentIsRunning = scraper.getIsRunning();
    scraper.setIsRunning(true);
    if (!currentIsRunning) {
        scraper.scrapeTwitter();
    }
}

function stopScraping() {
    logger.info('appManager: stopScraping');
    scraper.setIsRunning(false);
}

function resumeScraping() {
    logger.info('appManager: resumeScraping');
}

function quitApp() {
    logger.info('appManager: quitApp');
    process.exit(1);
}

function setScraperQuery(queryString){
    stopScraping();
    logger.info('appManager: scrape query set to: ' + queryString);
    scraper.setScraperQuery(queryString);
}

module.exports = {
    startScraping: startScraping,
    stopScraping: stopScraping,
    resumeScraping: resumeScraping,
    quitApp: quitApp,
    setScraperQuery: setScraperQuery
};