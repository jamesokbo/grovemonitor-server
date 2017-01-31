myApp.controller('mainRPiController', ['$scope', 'Socket', function MonitorController($scope, Socket) {
    $scope.monitors=[];
    $scope.monitorIDs=[];
    $scope.activeMonitor;
    $scope.envMonitors=[];
    $scope.resMonitors=[];
    
    $scope.nameEdit=false;
    $scope.newName="";
    
    //USER EVENTS
    $scope.activateMonitor=function(monitorID){
        $scope.activeMonitor=$scope.monitors[$scope.monitorIDs.indexOf(monitorID)];
        console.log('activated monitor: '+$scope.activeMonitor.monitorID);
        //TODO: Activate the monitor on the monitor side, so that it starts reading continously and the readings get directly here 
    };
    $scope.deactivateMonitor=function(){
      $scope.activeMonitor=null;  
    };
    $scope.mReading= function(data){
        console.log(data.mainRPiID);
        Socket.emit('mReading',data,function(res,err){
            if(err){
                throw err;
            }
            $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)][data.type].lastReading=res.reading;
            $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)][data.type].lastDate=res.date;
            $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)][data.type].status=res.status;
        });
    };
    
    //FUNCTIONAL
    $scope.loadMonitor=function(monitorID){
        var newMonitor;
        Socket.emit('loadMonitor',{monitorID:monitorID},function(res,err) {
           if(err){
               throw err;
            }
            console.log(res);
            newMonitor=res;
            $scope.monitors[$scope.monitorIDs.indexOf(monitorID)]=newMonitor;
            if(newMonitor.type=='envMonitor'){
                $scope.envMonitors[$scope.envMonitorIDs.indexOf(newMonitor.monitorID)]=newMonitor;
            }
            if(newMonitor.type=='resMonitor'){
               $scope.resMonitors[$scope.resMonitorIDs.indexOf(newMonitor.monitorID)]=newMonitor;
            }
        }); 
    };
    $scope.loadMonitors=function(){
        $scope.monitors=[];
        $scope.monitorIDs=[];
        $scope.envMonitors=[];
        $scope.envMonitorIDs=[];
        $scope.resMonitors=[];
        $scope.resMonitorIDs=[];
        
        console.log('requesting monitors of mainRPi: '+$scope.mainRPi.mainRPiID);
        Socket.emit('loadMonitors',{mainRPiID:$scope.mainRPi.mainRPiID},function(res,err){
            if(err){
                throw err;
            }
            console.log('received '+res.length+' monitors for mainRPi: '+$scope.mainRPi.mainRPiID);
            $scope.monitors=res;
            
            for(var i=0; i<res.length; i++){
                $scope.monitorIDs[i]=res[i].monitorID;
                if(res[i].type=='envMonitor'){
                    $scope.envMonitorIDs.push(res[i].monitorID);
                    $scope.envMonitors.push(res[i]);
                }
                else if(res[i].type=='resMonitor'){
                    $scope.resMonitorIDs.push(res[i].monitorID);
                    $scope.resMonitors.push(res[i]);
                }
            }
            console.log($scope.monitors);
        });
    };
    $scope.toggleMainRPiNameEdit=function(){
      if($scope.nameEdit){
          $scope.nameEdit=false;
          $scope.newName="";
      }  
      else{
        $scope.nameEdit=true;
      }
    };
    
    //Monitor General Settings
    $scope.monitorNameEdit=false;
    $scope.tempUnitEdit=false;
    $scope.newTempUnit="Celsius";
    $scope.newMonitorName="";
    $scope.monitorSettings=false;
    $scope.lBoundEdit=false;
    $scope.uBoundEdit=false;
    $scope.newLBound;
    $scope.newUBound;
    
    $scope.toggleMonitorSettings=function(){
        if($scope.monitorSettings){
            $scope.monitorSettings=false;
        }  
        else{
            $scope.monitorSettings=true;
        }
    };
    $scope.toggleTempUnitEdit=function(){
        $scope.deactivateEdit();
        if($scope.tempUnitEdit){
            $scope.tempUnitEdit=false;
        }  
        else{
            $scope.tempUnitEdit=true;
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
    $scope.editMonitorName=function(data){
      if(data.newName!=""){
        console.log('editing name');
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
    $scope.editMonitorTempUnit=function(data){
        console.log('editing tempUnit');
        Socket.emit('editMonitorTempUnit',data,function(response,err){
            if(err){
                throw err;
            }
            if(response.status){
                //TODO: Load the individual monitor
                $scope.monitors[$scope.monitorIDs.indexOf(data.monitorID)].tempUnit=data.newUnit;
                $scope.deactivateEdit();
            }
        });
    };
    $scope.deactivateEdit=function(){
        $scope.monitorNameEdit=false;
        $scope.tempUnitEdit=false;
        $scope.lBoundEdit=false;
        $scope.uBoundEdit=false;
        $scope.newUBound=null;
        $scope.newLBound=null;
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
    $scope.editLBound=function(data){
        console.log('editing lBound');
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
        console.log('editing uBound');
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
    
    //RUN WHEN MAINRPI IS INSTANCIATED
    console.log('instantiated mainRPiController for mainRPi: '+$scope.mainRPi.mainRPiID);
    $scope.loadMonitors();
}]);