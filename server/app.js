var express = require('express');
var app = express();
var logger = require('../common/logger.js');
var serverPublish = require('./redis/serverPublish.js');

//folder to server static files (images,js,css)
app.use(express.static('public'));

serverPublish.initialise();

app.get('/startScraper', function(req, res){
    logger.info('onClient: start scraper');
    serverPublish.sendMessage(serverPublish.serverOperations.startScraper);
});

app.get('/stopScraper', function(req, res){
    logger.info('onClient:stop scraper');
    serverPublish.sendMessage(serverPublish.serverOperations.stopScraper);
});

app.get('/quitScraper', function(req, res){
    logger.info('onClient: quit scraper');
    serverPublish.sendMessage(serverPublish.serverOperations.quitScraper);
});

// app.post('/', function(req, res){
//     res.send('Hello Post');    
// });

// app.get('/process_get', function(req, res){
//     var response = {
//         first_name: req.query.first_name,
//         last_name: req.query.last_name
//     };

//     logger.info('GET: ' + response);
//     res.end(JSON.stringify(response));
// });

var server = app.listen(3000, '127.0.0.1', function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening on http://%s:%s", host, port);
});