myApp.directive('mainrpi', function(){
    return {
        restrict : 'E',
        scope:false,
        controller: 'mainRPiController',
        templateUrl : '/templates/mainRPi.html',
    };
});