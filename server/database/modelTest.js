var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ModelTestSchema = new Schema({
    _name: String,
    _value: Number
});

var ModelTest = mongoose.model('ModelTest', ModelTestSchema);

module.exports = ModelTest;