var indexCtrl = function($scope){

    console.log('index init');

    $scope.input = 'test';
};

angular
    .module('clientApp', [])
    .controller('indexCtrl', indexCtrl);