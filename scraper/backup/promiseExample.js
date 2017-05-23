var queryLength = queryBuilder.queryList.length;

console.log('queries to call: ' + queryLength);

// function to return a promise
function retrieveTweetsPromise(data){
    var deferred = q.defer();
    if(data !== null){
        console.log('data in');    
        deferred.resolve(data);
    } else {
        console.log('data null');
        deferred.reject(data);
    }
    //small change
    return deferred.promise;
}

// function to handle the succesful return of data
function retrieveSuccess(data){
    console.log('data success');
    console.log(data);
}

// function to handle the error return of data
function retrieveError(error){
    console.log(error);
}

//handling function
function retrievePromise(data){
    retrieveTweetsPromise(data)
        .then(retrieveSuccess, retrieveError);
}

retrievePromise(queryBuilder.queryList);