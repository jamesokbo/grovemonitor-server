var mongoose=require('../../mongoose');
var MainRPi=require('../models/mainRPi.js');
var Monitor=require('../models/monitor.js');
var monArrays=require('../monitorArrays.js');

module.exports=function(socket){
  socket.on('disconnect', function(){
    console.log('lost a connection!');
    if(socket.mainRPiID!=''){
      MainRPi.update({mainRPiID:mongoose.Types.ObjectId(socket.mainRPiID)},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
        if(err){
          throw err;
        }
        console.log(res.ok +' '+res.nModified);
        if(res.ok==1 && res.nModified==1){
          Monitor.update({mainRPiID:socket.mainRPiID},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
            if(err){
              throw err;
            }
            if(monArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString())!=-1){
              console.log('monitor: '+socket.mainRPiID+' has disconnected!');
              monArrays.mainRPis.splice(monArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
              monArrays.mainRPiIDs.splice(monArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
            }
          });
        }
      });
    }
  });
};