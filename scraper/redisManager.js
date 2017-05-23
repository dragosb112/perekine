var redis = require('redis');
var appManager = require('./appManager.js');

var channelName = 'server';
var subscriber = redis.createClient();

function initialise() {
    subscriber.on('message', function (channel, message) {
        if (channel === channelName) {
            switch (message) {
                case '1':
                    appManager.startScraping();
                    break;
                case '2':
                    appManager.stopScraping();
                    break;
                case '3':
                    appManager.resumeScraping();
                    break;
                case '4':
                    appManager.quitApp();
                    break;
            }
        }
    });

    subscriber.subscribe(channelName);
}

module.exports = {
    initialise: initialise,
};