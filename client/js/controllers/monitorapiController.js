myApp.controller('monitorapiController', ['$scope', 'Socket', 'AuthService', function($scope, Socket, AuthService){
    console.log("entered monitorapiController");
    $scope.monitors=[];
    $scope.addForm=false;
    $scope.form={};
    $scope.phReadings=[];
    $scope.phData=[];
    $scope.ecReadings=[];
    $scope.ecData=[];
    $scope.aTempReadings=[];
    $scope.aTempData=[];
    $scope.wTempReadings=[];
    $scope.wTempData=[];
    $scope.rhReadings=[];
    $scope.rhData=[];
    $scope.luxReadings=[];
    $scope.luxData=[];
    $scope.phForm=[];
    $scope.ecForm=[];
    $scope.aTempForm=[];
    $scope.wTempForm=[];
    $scope.rhForm=[];
    $scope.luxForm=[];
    $scope.form.name='';
    $scope.form.email='';
    $scope.form.password='';
    $scope.user={};
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
    $scope.ecOptions={
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
			    label: 'EC',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			},
			yDomain: [0,3]
		}
    };
    $scope.aTempOptions={
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
			    label: 'Ambient Temperature',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			}
		}
    };
    $scope.wTempOptions={
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
			    label: 'Nutrient Solution Temperature',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			}
		}
    };
    $scope.rhOptions={
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
			    label: 'Relative Humidity',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			}
		}
    };
    $scope.luxOptions={
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
			    label: 'Light intensity',
			    axisLabelDistance: -10,
			    showMaxMin:true,
				tickFormat : function(d) {
					return d3.format('.02f')(d)
				}
			}
		}
    };
    
    //FUNCIONES ÚTILES PARA LA FUNCIONALIDAD
    //Obtener temperatura con unidad
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
    //Obtener unidad de temperatura de un monitor específico
    $scope.getTempUnit=function(index){
        var unit=$scope.monitors[index].tempUnit;
        if(unit=='Celsius'){
            return '°C';
        }
        else if(unit=='Fahrenheit'){
            return '°F';
        }
    };
    //Obtener una lectura convertida
    $scope.getConvertedTemp=function(reading,unit){
        var convertedReading=0;
        if(unit=='Celsius'){
            return reading;
        }
        else if(unit=='Fahrenheit'){
            convertedReading=(reading-32)*(5/9);
            return convertedReading;
        }
    };
    //Volver a cargar un solo monitor, puede ser porque se cambiaron algunas preferencias de este
    $scope.loadMonitor=function(index){
        Socket.emit('loadMonitor',{monitorID:$scope.monitors[index]._id, userID:$scope.user._id},function(err,response){
            if(err){
                throw err;
            }
            else{
                $scope.monitors[index]=response;
            }
        });
    };
    //Cargar todos los monitores asociados a un usuario
    $scope.loadMonitors = function(userID){
        if(userID!=''){
            Socket.emit('loadMonitors', {userID:userID}, function(err,response) {
                console.log("recibidos monitores "+response);
                if(err){
                    throw err;
                }
                $scope.monitors=response;
                $scope.phForm=[];
                $scope.ecForm=[];
                $scope.aTempForm=[];
                $scope.wTempForm=[];
                $scope.rhForm=[];
                $scope.luxForm=[];
                for(var i in response){
                    $scope.phForm.push[i];
                    $scope.ecForm.push[i];
                    $scope.aTempForm.push[i];
                    $scope.wTempForm.push[i];
                    $scope.rhForm.push[i];
                    $scope.luxForm.push[i];
                }
            });
        }
    };
    
    //FUNCIONES DE LECTURA DE SENSORES
    //Solicitar lecturas de sensores de manera individual
    $scope.mPhReading=function(index){
        Socket.emit('mPhReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status){
                console.log('got the reading!');
                $scope.monitors[index].phLast.reading=res.reading;
                $scope.monitors[index].phLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].phLast.error=res.error;
            }
        });
    };
    $scope.mEcReading=function(index){
        Socket.emit('mEcReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status=='ok'){
                $scope.monitors[index].ecLast.reading=res.reading;
                $scope.monitors[index].ecLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].ecLast.error=res.error;
            }
        });
    };
    $scope.mATempReading=function(index){
        Socket.emit('mATempReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status=='ok'){
                $scope.monitors[index].aTempLast.reading=res.reading;
                $scope.monitors[index].aTempLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].aTempLast.error=res.error;
            }
        });
    };
    $scope.mWTempReading=function(index){
        Socket.emit('mWTempReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status=='ok'){
                $scope.monitors[index].wTempLast.reading=res.reading;
                $scope.monitors[index].wTempLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].wTempLast.error=res.error;
            }
        });
    };
    $scope.mRhReading=function(index){
        Socket.emit('mRhReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status=='ok'){
                $scope.monitors[index].rhLast.reading=res.reading;
                $scope.monitors[index].rhLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].rhLast.error=res.error;
            }
        });
    };
    $scope.mLuxReading=function(index){
        Socket.emit('mLuxReading', {monitorID: $scope.monitors[index]._id},function(res){
            if(res.status=='ok'){
                $scope.monitors[index].luxLast.reading=res.reading;
                $scope.monitors[index].luxLast.date=res.date; 
            }
            else{
                console.log(res.error);
                $scope.monitors[index].luxLast.error=res.error;
            }
        });
    };
    
    //Cuando el usuario solicita una lectura manual, todos los sensores de jalón
    $scope.requestReading=function(index){
        Socket.emit('mReading',{monitorID: $scope.monitors[index]._id},function(response,err){
            if(err){
                console.log(err);
                throw err;
            }
            $scope.monitors[index].phLast.reading=response.phLast.reading;
            $scope.monitors[index].phLast.date=response.phLast.date;
            $scope.monitors[index].ecLast.reading=response.ecLast.reading;
            $scope.monitors[index].ecLast.date=response.ecLast.date;
            $scope.monitors[index].aTempLast.reading=response.aTempLast.reading;
            $scope.monitors[index].aTempLast.date=response.aTempLast.date;
            $scope.monitors[index].wTempLast.reading=response.wTempLast.reading;
            $scope.monitors[index].wTempLast.date=response.wTempLast.date;
            $scope.monitors[index].rhLast.reading=response.rhLast.reading;
            $scope.monitors[index].rhLast.date=response.rhLast.date;
            $scope.monitors[index].luxLast.reading=response.luxLast.reading;
            $scope.monitors[index].luxLast.date=response.luxLast.date;
            
        });
    };
    //Redondear a 1 decimal
    $scope.oneDecimal=function(number){
      return Math.round(number*10)/10;  
    };
    
    //Cuando el usuario solicita datos históricos para graficar
    //USANDO NVD3
    $scope.phHistoric=function(index){
        console.log('Pidiendo phHistoric');
        $scope.phReadings[index]=[];
        $scope.phData[index]=[];
        $scope.phForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.phForm[index]);
        
        if($scope.phForm[index].toDate>$scope.phForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.phForm[index]);
            Socket.emit('phHistoric',$scope.phForm[index],function(response,err){
                if(err){
                    throw err;
                }
                $scope.phForm[index]={};
                console.log(response);
                
                for(var i = 0; i < response.length; i++){
                    //var date= new Date(response[i].date);
                    //$scope.phReadings[index].push(response[i].reading);
                    //$scope.phDates[index].push(date.toISOString().slice(0,10));
                    $scope.phReadings[index].push({x:response[i].date, y:response[i].reading});
                }
                $scope.phData[index].push({
                    values:$scope.phReadings[index],
                    key:'pH',
                    color: '#ffe066'
                });
                /*
                $scope.phReadings[index]=[$scope.phReadings[index]];
                console.log($scope.phReadings[index]);
                console.log($scope.phDates[index]);
                */
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    $scope.ecHistoric=function(index){
        console.log('Pidiendo ecHistoric');
        $scope.ecReadings[index]=[];
        $scope.ecData[index]=[];
        $scope.ecForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.ecForm[index]);
        if($scope.ecForm[index].toDate>$scope.ecForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.phForm[index]);
            Socket.emit('ecHistoric',$scope.ecForm[index],function(response,err){
                if(err){
                    throw err;
                }
                $scope.ecForm[index]={};
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    $scope.ecReadings[index].push({x:response[i].date, y:response[i].reading});
                }
                $scope.ecData[index].push({
                    values:$scope.ecReadings[index],
                    key:'EC',
                    color: '#ffe066'
                });
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    $scope.aTempHistoric=function(index){
        console.log('Pidiendo aTempHistoric');
        $scope.aTempReadings[index]=[];
        $scope.aTempData[index]=[];
        $scope.aTempForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.aTempForm[index]);
        if($scope.aTempForm[index].toDate>$scope.aTempForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.phForm[index]);
            Socket.emit('aTempHistoric',$scope.aTempForm[index],function(response,err){
                if(err){
                    throw err;
                }
                var unit=$scope.getTempUnit(index);
                $scope.aTempForm[index]={};
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    var convertedReading=$scope.getConvertedTemp(response[i].reading, $scope.monitors[index].tempUnit);
                    $scope.aTempReadings[index].push({x:response[i].date, y:convertedReading});
                }
                $scope.aTempData[index].push({
                    values:$scope.aTempReadings[index],
                    key:'Temperature in '+unit,
                    color: '#ffe066'
                });
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    $scope.wTempHistoric=function(index){
        console.log('Pidiendo aTempHistoric');
        $scope.wTempReadings[index]=[];
        $scope.wTempData[index]=[];
        $scope.wTempForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.wTempForm[index]);
        if($scope.wTempForm[index].toDate>$scope.wTempForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.wTempForm[index]);
            Socket.emit('wTempHistoric',$scope.wTempForm[index],function(response,err){
                if(err){
                    throw err;
                }
                var unit=$scope.getTempUnit(index);
                $scope.wTempForm[index]={};
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    var convertedReading=$scope.getConvertedTemp(response[i].reading, $scope.monitors[index].tempUnit);
                    $scope.wTempReadings[index].push({x:response[i].date, y:convertedReading});
                }
                $scope.wTempData[index].push({
                    values:$scope.wTempReadings[index],
                    key:'Temperature in '+unit,
                    color: '#ffe066'
                });
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    $scope.rhHistoric=function(index){
        console.log('Pidiendo rhHistoric');
        $scope.rhReadings[index]=[];
        $scope.rhData[index]=[];
        $scope.rhForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.rhForm[index]);
        if($scope.rhForm[index].toDate>$scope.rhForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.phForm[index]);
            Socket.emit('rhHistoric',$scope.rhForm[index],function(response,err){
                if(err){
                    throw err;
                }
                $scope.rhForm[index]={};
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    $scope.rhReadings[index].push({x:response[i].date, y:response[i].reading});
                }
                $scope.rhData[index].push({
                    values:$scope.rhReadings[index],
                    key:'Electrical Conductivity',
                    color: '#ffe066'
                });
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    $scope.luxHistoric=function(index){
        console.log('Pidiendo luxHistoric');
        $scope.luxReadings[index]=[];
        $scope.luxData[index]=[];
        $scope.luxForm[index].monitorID=$scope.monitors[index]._id;
        console.log($scope.luxForm[index]);
        if($scope.luxForm[index].toDate>$scope.luxForm[index].fromDate){
            console.log('enviando a través de socket: '+$scope.phForm[index]);
            Socket.emit('luxHistoric',$scope.luxForm[index],function(response,err){
                if(err){
                    throw err;
                }
                $scope.luxForm[index]={};
                console.log(response);
                for(var i = 0; i < response.length; i++){
                    $scope.luxReadings[index].push({x:response[i].date, y:response[i].reading});
                }
                $scope.luxData[index].push({
                    values:$scope.luxReadings[index],
                    key:'Light in Lux',
                    color: '#ffe066'
                });
            });
        }
        else{
            bootbox.alert('End Date must be more recent than Start Date');
        }
    };
    
    $scope.delete=function(index){
        bootbox.confirm("Are you sure you want to delete this monitor? Deleting this monitor will cause all of its historical records to be deleted...", function(ans){
            if(ans){
                console.log($scope.monitors[index]._id);
                Socket.emit('removeMonitor', {id:$scope.monitors[index]._id, userId:$scope.user._id},function(response,err){
                   if(err){
                       throw err;
                   }
                   if(response.ok==1 && response.nModified==1){
                       bootbox.alert('Monitor '+$scope.monitors[index]._id+" Deleted!");
                       $scope.loadMonitors($scope.user._id);
                   }
                });
            }
        });
    };
    
    //El usuario agrega a su perfil un monitor ya existente en la base de datos.
    $scope.addToDatabase= function(){
        $scope.form.userID=$scope.user._id;
        if($scope.form.monitorID!='' && $scope.form.name!=''){
            if($scope.form.monitorID.length==24){
            console.log('enviando el monitor a través de socket');
            Socket.emit('addMonitor',$scope.form,function(response,err){
                if(err){
                    console.log(err);
                    throw err;
                }
    
                if(response.ok==1 && response.nModified==1){
                    console.log('Se agregó el monitor!');
                    $scope.form={};
                    $scope.falseAddForm();
                    $scope.loadMonitors($scope.user._id);
                }
                else{
                    bootbox.alert("MonitorID is incorrect or it already belongs to someone else");
                }
            });
            }
            else{
                bootbox.alert("MonitorID is incorrect");
            }
        }
        else{
            bootbox.alert("You must enter a Name and the MonitorID!")
        }
           
    };
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.emit('disconnect');
    });
 
    $scope.trueAddForm= function(){
        $scope.addForm=true;    
    };
    $scope.falseAddForm= function(){
        $scope.addForm=false;    
    };
    
    
    //AQUÍ SE DEFINEN LOS PROCEDIMIENTOS QUE CORREN EN AUTOMÁTICO
    //Despliega todos los monitores asociados a un usuario
    AuthService.getCurrentUser(function(data){
        $scope.user=data;
        $scope.loadMonitors($scope.user._id);
    });
}]);