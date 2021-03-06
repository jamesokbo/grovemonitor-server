//Initialize express framework
var express =require('express');
var app=express();
var fs=require('fs');

var http= require('http').Server(app);
var http2= require('http').Server(app);
var monitorIO=require('socket.io')(http2);
var io=require('socket.io')(http);

//native NodeJS module for resolving paths
var path=require('path');

var mongoose= require('mongoose');
var configDB= require('./server/config/database.js');

mongoose.connect(configDB.url);
var bodyParser =require('body-parser');
var methodOverride= require('method-override');

var morgan =require('morgan');

var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var flash=require('connect-flash');

var cookieParser=require('cookie-parser');
var session = require('express-session');


app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({secret: 'grovesecret', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));

var port= process.env.PORT;

app.set('view engine','ejs');
app.set('views', path.resolve(__dirname,'client','views'));
app.use(express.static(path.resolve(__dirname,'client')));

//COMUNICACIÓN CON LOS USUARIOS, LOS MONITORES Y SUS BASES DE DATOS A TRAVÉS DE SOCKET.IO
//Mongoose MainRPiSchema
var MainRPi=require('./server/models/mainRPi');
//Mongoose readingSchema
var Reading=require('./server/models/reading');
//Mongoose monitorSchema
var Monitor=require('./server/models/monitor');
//Mongoose userSchema
var User=require('./server/models/user');
//Monitor arrays
var mainRPiArrays=require('./server/mainRPiArrays.js');
//User arrays
var userArrays=require('./server/userArrays.js');

//TEST TO INSTANTIATE MONITOR EXAMPLE
//var monitor=new Monitor();
//monitor.save();


//Configuración de passport para autentificación de usuario
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Lógica de comunicación con el mainRPi (Identificación y lecturas manuales)
monitorIO.on('connection', function(socket){
  console.log("received new mainRPi connection");
  socket.mainRPi=new MainRPi();
  socket.mainID='';
  require('./server/mainRPiSocketEvents/disconnect.js')(socket);
  require('./server/mainRPiSocketEvents/mainRPiIdentification.js')(socket);
  require('./server/mainRPiSocketEvents/message.js')(socket);
  require('./server/mainRPiSocketEvents/monitorDisconnect.js')(socket);
  require('./server/mainRPiSocketEvents/monitorIdentification.js')(socket);
  require('./server/mainRPiSocketEvents/rReading.js')(socket);
});

//Lógica de comunicación con los usuarios
io.on('connection', function(socket){
  console.log('A user has connected');
  //--SERVER EVENTS--
  //--ServerFunctionalEvents
  //identificación del usuario
  require('./server/userSocketEvents/serverEvents/serverFunctionalEvents/userIdentification.js')(socket);
  //Regresar el usuario asociado al email
  require('./server/userSocketEvents/serverEvents/userProfileEvents/checkEmail.js')(socket);
  //Cuando el usuario se desconecta
  socket.on('disconnect', function(){
    var userIndex=userArrays.userIDs.indexOf(socket.userID.toString());
    if(userIndex!=-1){
      userArrays.users.splice(userIndex,1);
      userArrays.userIDs.splice(userIndex,1);
    }
    socket.disconnect();
  });
  //Mensaje de prueba
  require('./server/userSocketEvents/serverEvents/serverFunctionalEvents/message.js')(socket);
  //--MAINRPI--
  //--MainRPiFunctionalEvents
  //Cuando el usuario agrega un mainRPi a su perfil, se debe checar si este monitor existe en la base de datos y no tiene un usuario asignado.
  require('./server/userSocketEvents/mainRPiEvents/mainRPiFunctionalEvents/addMainRPi.js')(socket);
  //Eliminar un mainRPi de su perfil
  require('./server/userSocketEvents/mainRPiEvents/mainRPiFunctionalEvents/deleteMainRPi.js')(socket);
  //Mandar el arreglo de mainRPis asociado a un usuario
  require('./server/userSocketEvents/mainRPiEvents/mainRPiFunctionalEvents/loadMainRPis.js')(socket);
  //--MainRPiSettingsEvents
  //Cuando el usuario edita el nombre de una MainRPi asociada a su perfil
  require('./server/userSocketEvents/mainRPiEvents/mainRPiSettingsEvents/editMainRPiName.js')(socket);
  //--MONITOR--
  //--monitorFunctionalEvents
  //Solicitar lecturas históricas de un sensor
  require('./server/userSocketEvents/monitorEvents/monitorFunctionalEvents/historicReadings.js')(socket);
  //Mandar el arreglo de monitores asociado a una mainRPi
  require('./server/userSocketEvents/monitorEvents/monitorFunctionalEvents/loadMonitors.js')(socket);
  //Load a specific monitor
  require('./server/userSocketEvents/monitorEvents/monitorFunctionalEvents/loadMonitor.js')(socket);
  //Request manual sensor reading
  require('./server/userSocketEvents/monitorEvents/monitorFunctionalEvents/mReading.js')(socket);
  //--monitorSettingsEvents
  //Add sensor
   require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/addSensor.js')(socket);
  //Edit LowerBound of any sensor
  require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/editLBound.js')(socket);
  //Edit UpperBound of any sensor
  require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/editUBound.js')(socket);
  //Edit CalibrationPoint of any sensor
  require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/editCalibration.js')(socket);
  //Edit MonitorName
  require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/editMonitorName.js')(socket);
  //Edit sensorUnit
  require('./server/userSocketEvents/monitorEvents/monitorSettingsEvents/editSensorUnit.js')(socket);
});

//DECLARACIÓN DE RUTAS DE APIS:
app.get('/',function(req,res){
  res.render('index.1.ejs');
});
//userAPI:
var userapi= express.Router();
require('./server/routes/userapi')(userapi, passport);
app.use('/',userapi);
//monitorAPI:
var monitorapi= express.Router();
require('./server/routes/monitorapi')(monitorapi);
app.use('/monitorapi',monitorapi);

//limpiar los estatus de conexión de los monitores y arrancar el servidor de sockets para monitores
MainRPi.update({},{$set:{status:false}},{multi:true},function(err,res){
  if(err){
    throw err;
  }
  Monitor.update({},{$set:{status:false}},{multi:true},function(err,res){
    if(err){
      throw err;
    }
    else{
      http2.listen(8081,function(){
        console.log('socketserver running @ port: 8081');
      });
    }
  });
});


//arrancar el servidor de la web app
http.listen(port, function(){
  console.log('server running @ port:'+port);
});
