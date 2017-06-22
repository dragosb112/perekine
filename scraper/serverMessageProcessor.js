/**
 * Redis Message Processor for 
 * messaging from server to scraper
 */

var logger = require('../common/logger');

var ServerMessageProcessor = function () {
    if (!(this instanceof ServerMessageProcessor)) {
        return new ServerMessageProcessor();
    }

    var self = this;

    logger.info('serverMessageProcessor created');

    ServerMessageProcessor.prototype.initialise = function () {

    };

    ServerMessageProcessor.prototype.process = function (message) {
        var returnObject = {};
        var remainingWords = null;

        if (!message) {
            return null;
        }

        //first word is message type
        returnObject.messageType = message.split(/ (.+)/)[0];
        remainingWords = message.split(/ (.+)/)[1];
        //second word is scraper instance
        returnObject.scraperId = remainingWords.split(/ (.+)/)[0];
        //third word is message body
        returnObject.messageBody = remainingWords.split(/ (.+)/)[1];

        return returnObject;
    };
};

module.exports = ServerMessageProcessor;