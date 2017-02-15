myApp.controller('monitorController', ['$scope', 'Socket', 'SensorService', function MonitorController($scope, Socket, SensorService) {
    
    //Monitor General Settings
    $scope.monitorNameEdit=false;
    $scope.newMonitorName="";
    $scope.monitorSettings=false;
    $scope.availableSensors=SensorService.sensors;
    $scope.newSensor='';
    
    $scope.availableSensors = $scope.availableSensors.filter(function(el){
      return !$scope.monitor.sensors.includes(el);
    });
    
    //Monitor Sensor Settings
    $scope.units=[];
    $scope.sensorUnitEdit=false;
    $scope.lBoundEdit=false;
    $scope.uBoundEdit=false;
    $scope.newLBound;
    $scope.newUBound;
    
    //Functions
    $scope.loadMonitor=function(monitorID,fn){
        Socket.emit('loadMonitor',{monitorID:monitorID},function(res,err){
           if(err){
               fn(null,err);
           }
           else{
               fn(res);
           }
        });
    };
    $scope.initiateMonitor=function(monitor){
      for(var i=0; i<monitor.sensors.length; i++){
          
      }  
    };
    
    $scope.toggleMonitorSettings=function(){
        if($scope.monitorSettings){
            $scope.monitorSettings=false;
        }  
        else{
            $scope.monitorSettings=true;
        }
    };
    $scope.toggleSensorUnitEdit=function(){
        $scope.deactivateEdit();
        if($scope.sensorUnitEdit){
            $scope.sensorUnitEdit=false;
        }  
        else{
            $scope.sensorUnitEdit=true;
        }
    };
    $scope.toggleMonitorNameEdit=function(){
        $scope.deactivateEdit();
        if($scope.monitorNameEdit){
            $scope.monitorNameEdit=false;
        }  
        else{
            $scope.monitorNameEdit=true;
        }
    };
    $scope.toggleLBoundEdit=function(){
        $scope.deactivateEdit();
        if($scope.lBoundEdit){
            $scope.lBoundEdit=false;
        }
        else{
            $scope.lBoundEdit=true;
        }
    };
    $scope.toggleUBoundEdit=function(){
        $scope.deactivateEdit();
        if($scope.uBoundEdit){
            $scope.uBoundEdit=false;
        }
        else{
            $scope.uBoundEdit=true;
        }
    };
    $scope.deactivateEdit=function(){
        $scope.monitorNameEdit=false;
        $scope.sensorUnitEdit=false;
        $scope.lBoundEdit=false;
        $scope.uBoundEdit=false;
        $scope.newSensorUnit=null;
        $scope.newUBound=null;
        $scope.newLBound=null;
        $scope.newSensor='';
    }; 
    
    
    /*
    $scope.editMonitorName=function(data){
      if(data.newName!=""){
        Socket.emit('editMonitorName',data,function(response,err){
            if(err){
                throw err;
            }
            if(response.status){
                //TODO: Load the individual monitor
                $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)].name=data.newName;
                $scope.deactivateEdit();
            }
        });
      }  
    };
    */
    $scope.getSensorUnits=function(sensor){
        SensorService.getSensorUnits(sensor,function(units){
            $scope.units=units;
        });
    };
    $scope.getConvertedReading=function(sensor,unit,reading){
        return SensorService.getConvertedReading(sensor,unit,reading);
    };
    $scope.editSensorUnit=function(sensor,newUnit){
        console.log('editing sensor unit');
        var data={
            monitorID:$scope.monitor.monitorID,
            sensor:sensor,
            newUnit:newUnit
        };
        Socket.emit('editSensorUnit',data,function(res,err){
            if(err){
                console.log(err);
            }
            $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                if(err){
                    console.log(err);
                }
                $scope.monitor=res;
                $scope.deactivateEdit();
            });
        });
    };
    /*
    $scope.editLBound=function(data){
        Socket.emit('editLBound',data,function(response,err){
            if(err){
                throw err;
            }
            if(response.status){
                //TODO: place the new boundary without loading the monitor
                $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)][data.type].lBound=data.newLBound;
                $scope.deactivateEdit();
            }
        });
    };
    $scope.editUBound=function(data){
        Socket.emit('editUBound',data,function(response,err){
            if(err){
                throw err;
            }
            if(response.status){
                //TODO: place the new boundary without loading the monitor
                $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)][data.type].uBound=data.newUBound;
                $scope.deactivateEdit();
            }
        });
    };
    */
    $scope.mReading= function(data){
        Socket.emit('mReading',data,function(res,err){
            if(err){
                throw err;
            }
            $scope.monitor[data.sensor].lastReading=res.reading;
            $scope.monitor[data.sensor].lastDate=res.date;
            $scope.monitor[data.sensor].status=res.status;
        });
    };
    
    console.log('instantiated monitorController');
}]);