myApp.controller('monitorTestController', ['$scope', 'Socket', function($scope, Socket){
    console.log("entered monitorTestController");
    $scope.form={
      phReading:'',
      ecReading:'',
      aTempReading:'',
      rhReading:'',
      wTempReading:'',
    };
    $scope.connectionStatus='';
    $scope.monitorID='575afde560285468907f2204';
    $scope.errorMessage='';
    $scope.successMessage='';
    
    $scope.phSubmit=function(){
        var data={};
        data.reading=$scope.form.phReading;
        data.date=Date.now();
        data.monitorID=$scope.monitorID;
        Socket.emit('rPhReading',data,function(response){
            if(response.status=='ok' && response.error==false){
                $scope.successMessage='pH reading registered correctly';
            }
        });
    };
    
    console.log('sending ID: '+$scope.monitorID+' through socket!')
    Socket.emit('identification',{monitorID:$scope.monitorID},function(response){
        $scope.connectionStatus=response.status;
    });
}]);