myApp.directive('monitor', function(){
    return{
        restrict : 'E',
        scope:{
            monitor:'=monitorData',
            mainRPi:'=mainRpi',
            activeMonitor:'='
        },
        controller: 'monitorController',
        templateUrl : '/templates/monitor.html'
    };
});