var mongoose=require('mongoose');
var MainRPi=require('../models/mainRPi.js');
var Monitor=require('../models/monitor.js');
var mainRPiArrays=require('../mainRPiArrays.js');

module.exports=function(socket){
  socket.on('disconnect', function(){
    if(socket.mainRPiID!=''){
      MainRPi.update({mainRPiID:mongoose.Types.ObjectId(socket.mainRPiID)},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
        if(err){
          throw err;
        }
        if(res.ok==1 && res.nModified==1){
          Monitor.update({mainRPiID:socket.mainRPiID},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
            if(err){
              throw err;
            }
            if(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString())!=-1){
              console.log('mainRPi: '+socket.mainRPiID+' has disconnected!');
              mainRPiArrays.mainRPis.splice(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
              mainRPiArrays.mainRPiIDs.splice(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
            }
          });
        }
      });
    }
  });
};