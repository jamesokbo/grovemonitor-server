myApp.controller('monitorController', ['$scope', 'Socket', 'SensorService', function MonitorController($scope, Socket, SensorService) {
    //Monitor General Settings
    $scope.monitorNameEdit=false;
    $scope.newMonitorName="";
    $scope.monitorSettings=false;
    $scope.availableSensors=SensorService.sensors;
    
    $scope.availableSensors = SensorService.sensors.filter(function(el){
      return !$scope.monitor.sensors.includes(el);
    });
    
    //Monitor Sensor Settings
    $scope.units=[];
  
    $scope.sensorUnitEdit=false;
    $scope.lBoundEdit=false;
    $scope.uBoundEdit=false;
    $scope.calibrationEdit=false;
    $scope.settings={};
    $scope.settings.newLBound=null;
    $scope.settings.newUBound=null;
    $scope.settings.newCalibration=null;
    $scope.settings.newSensor='';
    
    //Calibration Settings
    $scope.calibrationPoint='firstPoint';
    $scope.calibrationValue;
    $scope.calibrationDate;
    $scope.calibrationOptions=[];
    
    //Functions
    $scope.loadMonitor=function(monitorID,fn){
        Socket.emit('loadMonitor',{monitorID:monitorID},function(err,res){
           if(err){
               fn(null,err);
           }
           else{
               fn(res);
           }
        });
    };
    $scope.setCalibrationData=function(sensor, calibrationPoint){
        $scope.deactivateEdit();
        $scope.calibrationPoint=calibrationPoint;
        $scope.calibrationValue=SensorService.getConvertedReading(sensor,
        $scope.monitor[sensor].unit,$scope.monitor[sensor].calibration[calibrationPoint].value);
        $scope.calibrationDate=$scope.monitor[sensor].calibration[calibrationPoint].date;
        SensorService.getCalibrationOptions(sensor,function(data){
            $scope.calibrationOptions=data;
        });
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
    $scope.toggleCalibrationEdit=function(){
        $scope.deactivateEdit();
        if($scope.calibrationEdit){
            $scope.calibrationEdit=false;
        }
        else{
            $scope.calibrationEdit=true;
        }
    };
    $scope.deactivateEdit=function(){
        $scope.monitorNameEdit=false;
        $scope.sensorUnitEdit=false;
        $scope.newMonitorName='';
        $scope.lBoundEdit=false;
        $scope.uBoundEdit=false;
        $scope.calibrationEdit=false;
        $scope.newSensorUnit=null;
        $scope.settings.newLBound=null;
        $scope.settings.newLBound=null;
        $scope.settings.newCalibration=null;
        $scope.settings.newSensor='';
        
    };
    
    $scope.editMonitorName=function(){
        if($scope.newMonitorName!=""){
            var data={
                monitorID:$scope.monitor.monitorID,
                newMonitorName:$scope.newMonitorName
            };
            Socket.emit('editMonitorName',data,function(err,response){
                if(err){
                    console.log(err);
                }
                if(response.status){
                    //TODO: Load the individual monitor
                    $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                        if(err){
                            console.log(err);
                        }
                        $scope.monitor=res;
                        $scope.deactivateEdit();
                    });
                }
            });
        }  
    };
    $scope.getSensorUnits=function(sensor){
        SensorService.getSensorUnits(sensor,function(units){
            $scope.units=units;
        });
    };
    $scope.getConvertedReading=function(sensor,unit,reading){
        return SensorService.getConvertedReading(sensor,unit,reading);
    };
    $scope.getReadingInStandardUnit=function(sensor,reading){
        return SensorService.getReadingInStandardUnit(sensor,$scope.monitor[sensor].unit,reading);
    };
    $scope.editSensorUnit=function(sensor,newUnit){
        var data={
            monitorID:$scope.monitor.monitorID,
            sensor:sensor,
            newUnit:newUnit
        };
        Socket.emit('editSensorUnit',data,function(err,res){
            if(err){
                console.log(err);
            }
            $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                if(err){
                    console.log(err);
                }
                $scope.monitor=res;
                $scope.setCalibrationData(sensor,'firstPoint');
                $scope.deactivateEdit();
            });
        });
    };
    $scope.editLBound=function(sensor){
        var newLBound= $scope.getReadingInStandardUnit(sensor,$scope.settings.newLBound);
        var data={
            monitorID:$scope.monitor.monitorID,
            sensor:sensor,
            newLBound:newLBound
        };
        Socket.emit('editLBound',data,function(err,res) {
            if(err){
                console.log(err);
            }
            else{
                if(res.status){
                    $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                        if(err){
                            console.log(err);
                        }
                        $scope.monitor=res;
                        $scope.deactivateEdit();
                    });
                }
            }
            
        });
    };
    $scope.editUBound=function(sensor){
        var newUBound= $scope.getReadingInStandardUnit(sensor,$scope.settings.newUBound);
        var data={
            monitorID:$scope.monitor.monitorID,
            sensor:sensor,
            newUBound:newUBound
        };
        Socket.emit('editUBound',data,function(err,res) {
            if(err){
                console.log(err);
            }
            else{
                if(res.status){
                    $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                        if(err){
                            console.log(err);
                        }
                        $scope.monitor=res;
                        $scope.deactivateEdit();
                    });
                }
            }
        });
    };
    $scope.editCalibration=function(sensor){
        var newCalibration= $scope.getReadingInStandardUnit(sensor,$scope.settings.newCalibration);
        var data={
            monitorID:$scope.monitor.monitorID,
            sensor:sensor,
            calibrationPoint:$scope.calibrationPoint,
            newCalibration:newCalibration,
            date:Date.now()
        };
        Socket.emit('editCalibration',data,function(err,res) {
            if(err){
                console.log(err);
            }
            else{
                if(res.status){
                    $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                        if(err){
                            console.log(err);
                        }
                        $scope.monitor=res;
                        $scope.setCalibrationData(sensor,$scope.calibrationPoint);
                        $scope.deactivateEdit();
                    });
                }
            }
            
        });
    };
    $scope.mReading= function(data){
        Socket.emit('mReading',data,function(err,res){
            if(err){
                throw err;
            }
            $scope.monitor[data.sensor].lastReading=res.reading;
            $scope.monitor[data.sensor].lastDate=res.date;
            $scope.monitor[data.sensor].status=res.status;
        });
    };
    $scope.addSensor=function(){
        if($scope.settings.newSensor!=""){
            var data={
                monitorID:$scope.monitor.monitorID,
                newSensor:$scope.settings.newSensor
            };
            Socket.emit('addSensor',data,function(err,response){
                if(err){
                    console.log(err);
                }
                if(response.status){
                    //TODO: Load the individual monitor
                    $scope.loadMonitor($scope.monitor.monitorID,function(res,err){
                        if(err){
                            console.log(err);
                        }
                        $scope.monitor=res;
                        $scope.availableSensors = SensorService.sensors.filter(function(el){
                        return !$scope.monitor.sensors.includes(el);
                        });
                        $scope.deactivateEdit();
                    });
                }
            });
        }
    };
}]);