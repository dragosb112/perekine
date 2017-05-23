var fs = require('fs');

function KeywordDictionary(filename){
    var keywords = null;
    if(filename !== null){
        var line = fs.readFileSync(filename, 'utf8');
        keywords = line.split(' ');              
    }
    this.keywords = keywords;
}

module.exports = KeywordDictionary;