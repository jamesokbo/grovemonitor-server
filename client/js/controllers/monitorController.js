myApp.controller('monitorController', ['$scope', 'Socket', function MonitorController($scope, Socket) {
    $scope.ph;
    $scope.ec;
    $scope.do;
    $scope.wTemp;
    $scope.resLevel;
    $scope.rh;
    $scope.lux;
    $scope.aTemp;
    $scope.co2;
    $scope.historicForm=[];
    $scope.monitorData=[];

    $scope.historicReadings= function(monitorID){
        var data=$scope.historicForm[monitorID];
        data.monitorID=monitorID;
        Socket.emit('historicReadings',data,function(err,res){
            if(err){
                throw err;
            }
            console.log(res);
            $scope.monitorData[data.monitorID]=res;
        });
    };
    
    //FUNCTIONAL
    $scope.getConvertedTemp=function(reading,unit){
            var convertedReading=0;
            if(unit=='Celsius'){
                return reading;
            }
            else if(unit=='Fahrenheit'){
                convertedReading=Math.round((reading*9/5)+(32));
                return convertedReading;
            }
        };
    $scope.getTempWithUnit=function(reading,unit){
            var convertedReading=0;
            if(unit=='Celsius'){
                convertedReading=Math.round(reading).toString();
                return convertedReading+'°C';
            }
            else if(unit=='Fahrenheit'){
                convertedReading=Math.round((reading*9/5)+(32));
                convertedReading=convertedReading.toString();
                return convertedReading+'°F';
            }
        };
    $scope.getTempInCelsius=function(value,unit){
        var convertedValue=0;
        if(unit=='Celsius'){
                convertedValue=Math.round(value);
                return convertedValue;
            }
            else if(unit=='Fahrenheit'){
                convertedValue=Math.round((value-32)*5/9);
                return convertedValue;
            }
        
    };
    $scope.getTempUnit=function(index){
                var unit=$scope.mainRPis[index].tempUnit;
                if(unit=='Celsius'){
                    return '°C';
                }
                else if(unit=='Fahrenheit'){
                    return '°F';
                }
            };
    $scope.oneDecimal=function(number){
          return Math.round(number*10)/10;  
        };

    
    
    console.log('instantiated monitorController');
}]);