console.log('scraper init');

// mode modules
var fs = require('fs');
var q = require('q');

// twitter
var config = require('./twitter/config.js');
var twitterApi = require('./twitter/twitterApi.js');
var path = './output/twitter/';

// utilities
var output = null;
var stringUtilities = require('./utilities/stringUtilities');
var twitterDictionary = require('./dictionary/twitterDictionary.js');
var QueryBuild = require('./utilities/queryBuilder.js');
var queryBuilder = new QueryBuild(twitterDictionary.twitterDictionary(), 3);

//logger
var logger = require('./utilities/logger.js');
logger.info('twitter scraper init');

// properties
var queryCount = 0;
var waitTimeoutDefaultMs = 2000;
var waitErrorTimeoutDefaultMs = 5000;
var minRemainingCalls = 10;
var isRunning = false;

// search tweets in the query
function searchTweetsCurrentQueryList(queryList, currentCount) {
    var query = queryList[currentCount].join(' ');
    if (currentCount < queryList.length) {
        queryCount++;
    } else {
        queryCount = 0;
    }

    twitterApi.searchTweetsDeferred(config, query, true)
        .then(searchTweetsSuccess, searchTweetsError);
}

function searchTweetsSuccess(tweets) {
    logger.info('search tweets success');
    //logger.info('query: ' + query);
    logger.info('data: ' + tweets);
}

function searchTweetsError(error) {
    logger.error(error);
}

// store tweets from previous search
function storeTweetSearchResults(query, data) {
    var output = stringUtilities.createFilenameFromQuery(query);
    logger.info('total tweets: ' + data.length);
    fs.writeFileSync(path + (output || 'output.json'), JSON.stringify(data, null, 2));
    logger.info('tweet scrape done for: ' + query);
    //queryCount++;
}


function getRemainingCallsSuccess(twitterApiStatus) {
    logger.info(twitterApiStatus);
    var waitTimeoutMs = waitTimeoutDefaultMs;
    // if we can still make api calls
    if (twitterApiStatus.remaining > minRemainingCalls) {
        logger.info('if path');
        // search for tweets
        searchTweetsCurrentQueryList(queryBuilder.queryList, queryCount);
    }
    // otherwise set the timeout to the next reset time 
    else {
        logger.info('else path');
        var currentTicks = Date.now();
        var ticksUntilReset = twitterApiStatus.reset * 1000 - currentTicks;
        waitTimeoutMs = ticksUntilReset;
    }

    logger.info('waiting ' + waitTimeoutMs + 'ms before next api call');
    setTimeout(function () {
        scrapeTwitter();
    }, waitTimeoutMs);
}

function getRemainingCallsError(data) {
    logger.info(data);
    setTimeout(function () {
        scrapeTwitter();
    }, waitErrorTimeoutDefaultMs);
}

// Main App Loop
// Checks the remaining calls (recusrsive)
// On success searches twitter for queries
function scrapeTwitter() {
    if (isRunning) {
        twitterApi.getRemainingCalls(config)
            .then(getRemainingCallsSuccess, getRemainingCallsError);
    }
}

function setIsRunning(value) {
    if (isRunning !== value) {
        isRunning = value;
    }
}

module.exports = {
    setIsRunning: setIsRunning,
    scrapeTwitter: scrapeTwitter
};