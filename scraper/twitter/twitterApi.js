var Twit = require('twit');
var q = require('q');
var logger = require('../utilities/logger.js');


function searchTweetsDeferred(config, query, value) {
  logger.info('twitterApi: searchTweetsDeferred');
  var deferred = q.defer();
  var twitterClient = new Twit(config);
  var tweets = [];
  var delay = 200; // wait 200 milliseconds

  var fetchPage = function fetchPage(maxId, count) {
    count = count || 100;

    var params = {
      q: query,
      count: count.toString(),
      include_entities: 1
    };

    if (maxId) params.max_id = maxId;

    twitterClient.get('search/tweets', params, function (err, data, response) {
      if (err) {
        logger.error('error fetching search/tweets with params', params);
        logger.error(err.allErrors);
        deferred.reject(err);
        return deferred.promise;
      } else if (data && !err) {
        tweets = tweets.concat(data.statuses);
        logger.info('fetched ' + data.statuses.length + ' tweets, total tweets: ' + tweets.length);

        // no more data or rate limit reached on next call
        if (data.statuses.length === 0 || !data.search_metadata.next_results) {
          deferred.resolve(tweets);
          return deferred.promise;
        }

        var next = data.search_metadata.next_results;
        var re = next.match(/max_id=(\d+)/);

        if (!re) {
          deferred.resolve(tweets);
          return deferred.promise;
        }

        maxId = re[1];

        // recurive call
        setTimeout(function () {
          fetchPage(maxId);
        }, delay);
      }
    });
  };

  // initial call
  fetchPage(undefined);

  deferred.resolve(true)
  return deferred.promise;
}


var searchTweets = function (config, query, callback) {

  var twitterClient = new Twit(config);
  logger.info('fetch from search/tweets with query ' + query);
  var tweets = [];
  var delay = 200; // wait 200 milliseconds
  // recursive function
  var fetchPage = function fetchPage(maxId, callback, count) {

    count = count || 100;

    var params = {
      q: query,
      count: count.toString(),
      include_entities: 1
    };

    if (maxId) params.max_id = maxId;

    twitterClient.get('search/tweets', params, function (err, data, response) {
      if (err) {
        logger.error('error fetching search/tweets with params', params);
        logger.error(err.allErrors);
        callback(query, tweets);
        return;
        //process.exit(1);
      } else if (data && !err) {
        tweets = tweets.concat(data.statuses);
        logger.info('fetched ' + data.statuses.length + ' tweets, total tweets: ' + tweets.length);

        // no more data or rate limit reached on next call
        if (data.statuses.length === 0 || !data.search_metadata.next_results) {
          callback(query, tweets);
          return;
        }

        var next = data.search_metadata.next_results;
        var re = next.match(/max_id=(\d+)/);

        if (!re) {
          callback(query, tweets);
          return;
        }

        maxId = re[1];

        // recurive call
        setTimeout(function () {
          fetchPage(maxId, callback);
        }, delay);
      }

    });

  };

  // initial call
  fetchPage(undefined, callback);

};

function getRemainingCalls(config) {
  var twitter = new Twit(config);
  var deferred = q.defer();
  twitter.get('application/rate_limit_status', 'search', function (err, data, response) {
    if (err) {
      logger.error('rate limit request failed');
      logger.error(err);
      deferred.reject(err);
    }

    if (data.resources) {
      deferred.resolve(data.resources.search['/search/tweets']);
    }
  });

  return deferred.promise;
}

module.exports = {
  searchTweets: searchTweets,
  searchTweetsDeferred: searchTweetsDeferred,
  getRemainingCalls: getRemainingCalls,
};