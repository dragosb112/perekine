module.exports = {
    createFilenameFromQuery: createFilenameFromQuery,
};

function createFilenameFromQuery(query){
    if(query !== null){
        var filename = query.split(' ').join('_');
        filename = filename.concat('.json');
        return filename;
    }
};