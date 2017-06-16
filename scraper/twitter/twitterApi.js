var Twit = require('twit');
var q = require('q');
var logger = require('../../common/logger.js');

/**
 * search tweets
 * @param {twitter app config} config 
 * @param {word list to search for} query 
 * @param {function to handle search results} callback 
 */
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
        logger.error('query: ' + query + ', error fetching search/tweets with params', params);
        logger.error(err.allErrors);
        callback(query, tweets);
        return;
      } else if (data && !err) {
        tweets = tweets.concat(data.statuses);
        //logger.info('query: ' + query + ', fetched ' + data.statuses.length + ' tweets, total tweets: ' + tweets.length);

        // no more data or rate limit reached on next call
        if (data.statuses.length === 0 || !data.search_metadata.next_results) {
          logger.info('twitter api: ' + query + ' finshed; total tweets fetched: ' + tweets.length);
          callback(query, tweets);
          return;
        }

        var next = data.search_metadata.next_results;
        var re = next.match(/max_id=(\d+)/);

        if (!re) {
          logger.info('twitter api: ' + query + ' finshed; total tweets fetched: ' + tweets.length);
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

/**
 * get twitter status of remaining tweet searches
 * @param {twitter app config} config 
 */
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
  getRemainingCalls: getRemainingCalls,
};