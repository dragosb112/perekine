var logger = require('../common/logger.js');
var scraper = require('./scraper.js');

function quitApp() {
    logger.info('appManager: quitApp');
    process.exit(1);
}

function setScraperQuery(queryString) {
    stopScraping();
    logger.info('appManager: scrape query set to: ' + queryString);
    scraper.setScraperQuery(queryString);
}

function startScraper() {
    if (!scraper.fsm.is('running')) {
        scraper.fsm.start();
    }
}

function stopScraper() {
    if (!scraper.fsm.is('stopped')) {
        scraper.fsm.stop();
    }
}

function pauseScraper() {
    if (!scraper.fsm.is('stopped') && !scraper.fsm.is('paused')) {
        scraper.fsm.pause();
    }
}

module.exports = {
    quitApp: quitApp,
    setScraperQuery: setScraperQuery,
    startScraper: startScraper,
    stopScraper: stopScraper,
    pauseScraper: pauseScraper,

};