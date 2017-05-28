// mode modules
var fs = require('fs');
var q = require('q');

// twitter
var config = require('./twitter/config.js');
var twitterApi = require('./twitter/twitterApi.js');
var processArgs = require('../common/processArgs.js');
var path = processArgs.Args2.outputPath + '/twitter/';

// utilities
var output = null;
var stringUtilities = require('./utilities/stringUtilities');
var twitterDictionary = require('./dictionary/twitterDictionary.js');
var QueryBuild = require('./utilities/queryBuilder.js');
var queryBuilder = new QueryBuild(twitterDictionary.twitterDictionary(), 3);

//logger
var logger = require('../common/logger.js');
logger.info('twitter scraper init');

// properties
var queryCount = 0;
var waitTimeoutDefaultMs = 2000;
var waitErrorTimeoutDefaultMs = 5000;
var minRemainingCalls = 10;
var isRunning = false;

// search tweets in the query
function searchTweetsCurrentQueryList(queryList) {
    var query = queryList[queryCount].join(' ');
    if (queryCount < queryList.length - 1) {
        queryCount++;
    } else {
        queryCount = 0;
    }

    twitterApi.searchTweets(config, query, storeTweetSearchResults);
}

// function to wait and restart the search
function restartSearch(waitMs) {
    logger.info('waiting ' + waitMs + 'ms before next api call');
    setTimeout(function () {
        scrapeTwitter();
    }, waitMs);
}

// store tweets from previous search
function storeTweetSearchResults(query, data) {
    var output = stringUtilities.createFilenameFromQuery(query);
    logger.info('total tweets: ' + data.length);
    fs.writeFileSync(path + (output || 'output.json'), JSON.stringify(data, null, 2));
    logger.info('tweet scrape done for: ' + query);

    // restart the search after tweets were storec
    restartSearch(waitTimeoutDefaultMs);
}

// get remaining calls return success
function getRemainingCallsSuccess(twitterApiStatus) {
    logger.info(twitterApiStatus);
    // if we can still make api calls
    if (twitterApiStatus.remaining > minRemainingCalls) {
        // search for tweets
        searchTweetsCurrentQueryList(queryBuilder.queryList);
    }
    // otherwise set the timeout to the next reset time 
    else {
        var currentTicks = Date.now();
        var ticksUntilReset = twitterApiStatus.reset * 1000 - currentTicks;
        var waitTimeoutMs = ticksUntilReset;
        restartSearch(waitTimeoutMs);
    }
}

// get remaining calls return error
function getRemainingCallsError(data) {
    logger.info(data);
    setTimeout(function () {
        scrapeTwitter();
    }, waitErrorTimeoutDefaultMs);
}

// scrape twitter main controller function
function scrapeTwitter() {
    if (isRunning) {
        twitterApi.getRemainingCalls(config)
            .then(getRemainingCallsSuccess, getRemainingCallsError);
    }
}

// switch for controlling the operation of this module
function setIsRunning(value) {
    if (isRunning !== value) {
        isRunning = value;
    }
}

// get isRunning property
function getIsRunning(){
    return isRunning;
}

/**
 * Set scraper query from query string
 */
function setScraperQuery(queryString){
    var queryArray = stringUtilities.stringToStringArray(queryString);
    if(queryArray !== null){
        queryBuilder = new QueryBuild(queryArray, 3);
        var query = queryBuilder;        
    }
}

module.exports = {
    setIsRunning: setIsRunning,
    getIsRunning: getIsRunning,
    scrapeTwitter: scrapeTwitter,
    setScraperQuery: setScraperQuery
};