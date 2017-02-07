myApp.directive('mainrpi', function(){
    return {
        restrict : 'E',
        scope:{
            mainRPi:'=mainRpi',
            activeMainRPi:'=activeMainRpi'
        },
        controller: 'mainRPiController',
        templateUrl : '/templates/mainRPi.html',
    };
});