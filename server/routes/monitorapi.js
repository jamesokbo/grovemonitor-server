var MainRPi=require('../models/mainRPi');

module.exports= function(router){
    
    //Aquí se definen todas las funciones CRUD que el usuario puede hacer a la colección de monitores desde su perfil.
    //Esto es:
    //-Agregar el monitor a su perfil
    //-Ver los datos generales de sus monitores (Nombre, status, últimas lecturas de sensores, últimas calibraciones de pH)
    //-Obtener lecturas históricas de sensores de cada monitor
    //-Obtener lecturas actuales de sensores (Se debe disparar un mensaje al websocket del monitor cuando el usuario lo solicita)
    //-Calibrar sensor de pH (Se debe disparar un mensaje al websocket del monitor cuando el usuario lo solicita)
    
    
    
    //Agregar un monitor sin nombre a la colección de monitores (esto no se va a usar porque se asigna cuando se abre la
    //conexión websocket con el monitor por primera vez)
    /*
    router.post('/monitor/', function(req,res){
        var monitor= new MainRPi(); 
        monitor.monitorID=req.body.monitorID;
        monitor.save(function(err,data){
            if(err){
               throw err; 
            }
            else{
                console.log("no errors");
                res.json(data);
            }
        });
    });
    */
    
    //agregar un monitor nuevo a la base de datos
    router.post('/monitor', function(req,res){
        console.log(req.body);
        var monitor= new MainRPi(); 
        monitor.name=req.body.name;
        monitor.status=true;
        monitor.phCal4=Date.now();
        monitor.phCal7=Date.now();
        monitor.phCal10=Date.now();
        monitor.phLast.reading=Math.round((Math.random()*(8-4)*100))/100+4;
        monitor.phLast.date=Date(1464282641109);
        monitor.ecLast.reading=Math.round((Math.random()*(1.3)*100))/100;
        monitor.ecLast.date=Date(1464282641109);
        monitor.wTempLast.reading=Math.round((Math.random()*(36-16)+16*100))/100;
        monitor.wTempLast.date=Date(1464282641109);
        monitor.aTempLast.reading=Math.round((Math.random()*(32-12)+12*100))/100;
        monitor.aTempLast.date=Date(1464282641109);
        
        
        monitor.save(function(err,data){
            if(err){
               throw err; 
            }
            else{
                console.log("no errors");
                res.json(data);
            }
        });
    });
    
    //Obtener una lista de todos los monitores
    router.get('/monitor', function(req, res){
       MainRPi.find({}, function(err,data){
           res.json(data);
       }); 
    });
    
    //Eliminar todos los monitores (No se usará nunca, creo)
    /*
    router.delete('/monitor', function(req,res){
       MainRPi.remove({}, function(err,data){
          res.json({result: err ? 'error':'ok'}); 
       });
    });
    */
    
    //Obtener todos los monitores asociados a un usuario
    router.get('/monitor/:userid', function(req,res){
       MainRPi.find({userID: req.params.userid}, function(err,data){
           res.json(data);
       })
    });
    
    //Eliminar un monitor en específico
    router.delete('/monitor/:id', function(req,res){
       MainRPi.remove({_id:req.params.id}, function(err,data){
          res.json({result: err ? 'error':'ok'}); 
       });
    });
    
    //Editar el nombre del monitor
    router.post('/monitor/edit/:id', function(req,res){
       MainRPi.findOne({_id:req.params.id}, function(err,data){
           var monitor = data;
           monitor.name=req.body.name;
           monitor.save(function(err,data){
            if(err){
               throw err; 
            }
            else{
                console.log("no errors");
                res.json(data);
            }
        });
       }); 
    });
};
