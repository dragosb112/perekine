var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('test');
});

var server = app.listen(3000, '127.0.0.1', function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening on http://%s:%s", host, port);
});