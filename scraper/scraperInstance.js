/**
 * Scraper object
 */

// node modules
var fs = require('fs');
var q = require('q');

// twitter 
var twitterApi = require('./twitter/twitterApi.js');
var processArgs = require('../common/processArgs.js');
var logger = require('../common/logger');
var ScraperStateMachine = require('./scraperStateMachine');
var QueryBuild = require('./utilities/queryBuilder.js');
var stringUtilities = require('./utilities/stringUtilities');
var twitterDictionary = require('./dictionary/twitterDictionary.js');

var Scraper = function (config, instanceId) {
    if (!(this instanceof Scraper)) {
        return new Scraper(config, instanceId);
    }

    //TODO: validate config

    //validate instanceId
    if(!instanceId){
        logger.error('instanceId: ' + instanceId);
        //TODO: throw error
    }

    // properties
    var self = this;
    this.config = config;
    this.instanceId = instanceId;
    this.fsm = new ScraperStateMachine(onStart, onStop, onPause);
    this.queryBuilder = new QueryBuild(twitterDictionary.twitterDictionary(), 3);
    this.path = processArgs.outputPath + '/twitter/';    
    this.queryCount = 0;
    this.waitTimeoutDefaultMs = 2000;
    this.waitErrorTimeoutDefaultMs = 5000;
    this.minRemainingCalls = 10;

    logger.info('scraper Instance' + this.instanceId +
        ' created');

    /**
     * PUBLIC
     */

    Scraper.prototype.start = function () {
        this.fsm.start();
    };

    Scraper.prototype.stop = function () {
        this.fsm.stop();
    };

    Scraper.prototype.pause = function () {
        this.fsm.pause();
    };


    /**
     * set scraper query from query string
     * @param {words list to search for a space separated string} queryString 
     */
    Scraper.prototype.setScraperQuery = function(queryString) {
        var queryArray = stringUtilities.stringToStringArray(queryString);
        if (queryArray !== null) {
            this.queryBuilder = new QueryBuild(queryArray, 3);
        }
    };

    /**
     * return current fsm state
     */
    Scraper.prototype.getCurrentState = function() {
        return this.fsm.current;
    };

    /**
     * check fsm state is
     * @param {state as string} state 
     */
    Scraper.prototype.isState = function(state) {
        if (state !== null) {
            return this.fsm.is(state);
        }
    }


    /**
     * PRIVATE
     */

    /**
     * onStart fsm callback
     */
    function onStart() {

        logger.info('scraperInstance' + instanceId + ': ' + this.current);
        if (this.is('running')) {
            twitterApi.getRemainingCalls(self.config)
                .then(getRemainingCallsSuccess, getRemainingCallsError);
        }
    }

    /**
     * onStop fsm callback
     */
    function onStop() {
        logger.info('scraperInstance' + instanceId + ': ' + this.current);
    }

    /**
     * onPause fsm callback
     */
    function onPause() {
        logger.info('scraperInstance' + instanceId + ': ' + this.current);
    }

    /**
     * get remaining calls return success
     * @param {status of twitter application} twitterApiStatus 
     */
    function getRemainingCallsSuccess(twitterApiStatus) {
        logger.info(twitterApiStatus);
        // if we can still make api calls
        if (twitterApiStatus.remaining > self.minRemainingCalls) {
            // search for tweets
            searchTweetsCurrentQueryList();
        }
        // otherwise set the timeout to the next reset time 
        else {
            var currentTicks = Date.now();
            var ticksUntilReset = twitterApiStatus.reset * 1000 - currentTicks;
            var waitTimeoutMs = ticksUntilReset;
            restartSearch(waitTimeoutMs);
        }
    }

    /**
     * get remaining calls return error
     * TODO: handle errors gracefully
     * implement scrape so that it does not hit this and use it as a mechanism to restart
     * @param {err} data 
     */
    function getRemainingCallsError(data) {
        logger.info(data);
        //TODO: if error can recover restart search
        //otherwise kill it
        restartSearch(self.waitErrorTimeoutDefaultMs);
    }

    /**
     * search tweets in the query
     * @param {list of words to query twitter} queryList 
     */
    function searchTweetsCurrentQueryList() {
        var queryList = self.queryBuilder.queryList;
        var query = queryList[self.queryCount].join(' ');
        if (self.queryCount < queryList.length - 1) {
            self.queryCount++;
        } else {
            self.queryCount = 0;
        }

        twitterApi.searchTweets(self.config, query, storeTweetSearchResults);
    }

    /**
     * restart scrape operations 
     * @param {miliseconds to wait} waitMs 
     */
    function restartSearch(waitMs) {
        logger.info('waiting ' + waitMs + 'ms before next api call');
        setTimeout(function () {
            if (!self.fsm.is('stopped') && !self.fsm.is('paused')) {
                self.fsm.start();
            }
        }, waitMs);
    }

    /**
     * store the tweets found in the previous scrape to file
     * @param {query stored} query 
     * @param {tweets} data 
     */
    function storeTweetSearchResults(query, data) {
        var output = stringUtilities.createFilenameFromQuery(query);
        logger.info('total tweets: ' + data.length);
        fs.writeFileSync(self.path + (output || 'output.json'), JSON.stringify(data, null, 2));
        logger.info('tweet scrape done for: ' + query);

        // restart the search after tweets were storec
        restartSearch(self.waitTimeoutDefaultMs);
    }

}

module.exports = Scraper;