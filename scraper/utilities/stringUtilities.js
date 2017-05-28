function createFilenameFromQuery(query){
    if(query !== null){
        var filename = query.split(' ').join('_');
        filename = filename.concat('.json');
        return filename;
    }
}

function stringToStringArray(string){
    if(string){
        var stringArray = string.split(' ');
        return stringArray;
    }
    return null;
}

module.exports = {
    createFilenameFromQuery: createFilenameFromQuery,
    stringToStringArray: stringToStringArray
};  