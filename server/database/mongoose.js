var mongoose = require('mongoose');
var ModelTest = require('./modelTest.js');

//set up default
var mongoDbUri = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDbUri);

//get the default connection
var db = mongoose.connection;

/**
 * CONNECTION EVENTS
 */

/**
 * When successfully connected
 */
mongoose.connection.on('connected', function () {
    console.log('mongoose connection open to ' + mongoDbUri);
    initialiseDb();
});

/**
 * When the connection throws an error
 */
mongoose.connection.on('error', function (err) {
    console.log('mongoose connection error: ' + err);
});

/**
 * When the conneciton is disconnected
 */
mongoose.connection.on('disconnected', function () {
    console.log('mongoose connection disconnected');
});


function initialiseDb() {
   
    var modelTestInstance = new ModelTest({
        _name: 'test',
        _value: 0
    });
    
    modelTestInstance.save(function (err) {
        console.log('error: ' + err);
    });

    var query = ModelTest.find({_value: 0});
    query.exec(function(err, models){
        if(err){
            console.log(err);
            return;
        }

        console.log(models);
    });
}