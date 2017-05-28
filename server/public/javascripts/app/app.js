var app = angular.module('clientApp', []);

app.controller('indexCtrl', function($scope){
    $scope.startScraper = function(){        
        console.log('start scraper');
    };
});