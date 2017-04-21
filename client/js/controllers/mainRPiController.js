myApp.controller('mainRPiController', ['$scope', 'Socket', 'SensorService',
function MainRPiController($scope, Socket, SensorService) {
    $scope.monitors=[];
    $scope.monitorIDs=[];
    $scope.activeMonitorID='';

    $scope.nameEdit=false;
    $scope.newName="";
    
    //USER EVENTS
    $scope.toggleMonitor=function(monitorID){
        console.log('toggling monitor '+monitorID);
        if($scope.activeMonitorID!='' && $scope.activeMonitorID===$scope.monitors[$scope.monitorIDs.indexOf(monitorID)].monitorID){
            $scope.activeMonitorID='';
        }
        else{
            $scope.activeMonitorID=monitorID;
        }
        //TODO: Activate the monitor on the monitor side, so that it starts reading continously and the readings get directly here 
    };
    $scope.deactivateMonitor=function(){
        $scope.activeMonitorID='';
    };

    //FUNCTIONAL
    //Activar MainRPi
    $scope.activateMainRPi= function(mainRPi){
       $scope.activeMainRPi=mainRPi; 
    };
    $scope.loadMonitor=function(monitorID){
        var newMonitor;
        Socket.emit('loadMonitor',{monitorID:monitorID},function(err,res) {
           if(err){
               throw err;
            }
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
        Socket.emit('loadMonitors',{mainRPiID:$scope.mainRPi.mainRPiID},function(err,res){
            if(err){
                throw err;
            }
            var newMonitorIDs=[];
            $scope.monitors=res;
            
            for(var i=0; i<res.length; i++){
                newMonitorIDs[i]=res[i].monitorID;
            }
            $scope.monitorIDs=newMonitorIDs;
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
    
    //SERVER EVENTS
    Socket.on('mainRPiConnect',function(data){
        if(data.mainRPiID.toString()==$scope.mainRPi.mainRPiID.toString()){
            $scope.mainRPi.status=true;
            $scope.loadMonitors();
        }
    });
    Socket.on('mainRPiDisconnect',function(data){
        if(data.mainRPiID.toString()==$scope.mainRPi.mainRPiID.toString()){
            $scope.mainRPi.status=false;
            $scope.loadMonitors();
        }
    });
    
    //RUN WHEN MAINRPI IS INSTANCIATED
    $scope.loadMonitors();
    console.log($scope.mainRPi);
}]);