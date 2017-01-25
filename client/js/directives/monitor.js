myApp.directive('monitor', function(){
    return {
        restrict : 'E',
        scope:false,
        controller: 'monitorController',
        templateUrl : '/templates/monitor.html',
    };
});