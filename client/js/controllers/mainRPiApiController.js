myApp.controller('mainRPiApiController', ['$scope', 'Socket', 'AuthService', function($scope, Socket, AuthService){
    console.log("entered mainRPiApiController");
    $scope.mainRPis=[];
    $scope.mainRPiIDs=[];
    $scope.addForm=false;
    $scope.form={};
    $scope.form.name='';
    $scope.form.email='';
    $scope.form.password='';
    $scope.user={};
    $scope.activeMainRPi;
    //OPCIONES PARA GRAFICAR CON NVD3
    $scope.phOptions={
        chart : {
			type : 'lineChart',
			x : function(d) {
			    return d.x;
			},
			y : function(d) {
				return d.y;
			},
			height:200,
			useVoronoi : false,
			clipEdge : false,
			useInteractiveGuideline : true,
			xAxis : {
			    label: 'Date',
				showMaxMin : false,
				tickFormat : function(d) {
                    return d3.time.format('%d.%m.%y:%H')(new Date(d))
				}
			},
			yAxis : {
			    label: 'pH',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			}
		}
    };
    
    //FUNCIONES ÚTILES PARA LA FUNCIONALIDAD
    //Cargar todos los mainRPies asociados a un usuario
    $scope.loadMainRPis = function(userID,fn){
        if(userID!=''){
            Socket.emit('loadMainRPis', {userID:userID}, function(response, err) {
                if(err){
                    throw err;
                }
                $scope.mainRPis=response;
                for(var i=0;i<response.length;i++){
                    $scope.mainRPiIDs.push(response[i].mainRPiID);
                }
                console.log('received '+$scope.mainRPis.length+' mainRPis')
            });
        }
    };
    //Activar MainRPi
    $scope.activateMainRPi= function(mainRPi){
       $scope.activeMainRPi=mainRPi; 
    };
    //Cambiar nombre de MainRPi
    $scope.editMainRPiName=function(id, newName){
      if(newName!=""){
        console.log('editing name');
        Socket.emit('editMainRPiName',{mainRPiID:id, newName:newName},function(response,err){
            if(err){
                throw err;
            }
            if(response.status){
                $scope.loadMainRPis($scope.user._id);
            }
        });
      }  
    };
    //Borrar MainRPi
    $scope.deleteMainRPi=function(id){
        bootbox.confirm("Are you sure you want to delete this monitor? Deleting this monitor will cause all of its historical records to be deleted...", function(ans){
            if(ans){
                Socket.emit('deleteMainRPi', {mainRPiID:id, userID:$scope.user._id},function(response,err){
                   if(err){
                       throw err;
                   }
                   if(response.status){
                       $scope.loadMainRPis($scope.user._id);
                   }
                });
            }
        });  
    };
    //Toggle AddForm
    $scope.trueAddForm= function(){
        $scope.addForm=true;    
    };
    $scope.falseAddForm= function(){
        $scope.addForm=false;    
    };
    
    
    //El usuario agrega a su perfil un mainRPi ya existente en la base de datos.
    $scope.addToDatabase= function(){
        $scope.form.userID=$scope.user._id;
        if($scope.form.mainRPiID!='' && $scope.form.name!=''){
            if($scope.form.mainRPiID.length==24){
            console.log('enviando el mainRPi a través de socket');
            Socket.emit('addMainRPi',$scope.form,function(response,err){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log(response);
                if(response.status){
                    console.log('Se agregó el mainRPi!');
                    $scope.form={};
                    $scope.falseAddForm();
                    $scope.loadMainRPis($scope.user._id);
                }
                else{
                    bootbox.alert("MainRPiID is incorrect or it already belongs to someone else");
                }
            });
            }
            else{
                bootbox.alert("MainRPiID is incorrect");
            }
        }
        else{
            bootbox.alert("You must enter a Name and the MainRPiID!")
        }
           
    };
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.emit('disconnect');
    });

    
    
    //AQUÍ SE DEFINEN LOS PROCEDIMIENTOS QUE CORREN EN AUTOMÁTICO
    //Despliega todos los mainRPies asociados a un usuario
    AuthService.getCurrentUser(function(data){
        $scope.user=data;
        $scope.loadMainRPis($scope.user._id);
    });
}]);