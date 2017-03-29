var mongoose=require('mongoose');
var MainRPi=require('../models/mainRPi.js');
var Monitor=require('../models/monitor.js');
var mainRPiArrays=require('../mainRPiArrays.js');
var userArrays=require('../userArrays.js');

module.exports=function(socket){
  socket.on('disconnect', function(){
    if(socket.mainRPiID!=''){
      MainRPi.find({mainRPiID:mongoose.Types.ObjectId(socket.mainRPiID)},function(err, docs) {
        if(err){
          throw err;
        }
        if(docs.length>0){
          var userIndex=userArrays.userIDs.indexOf(docs[0].userID);
          if(userIndex!=-1){
            userArrays.users[userIndex].emit('mainRPiDisconnect',{mainRPiID:docs[0].mainRPiID});
          }
          MainRPi.update({mainRPiID:mongoose.Types.ObjectId(socket.mainRPiID)},{$set:{status:false, lastConnection:Date.now()}},
          function(err,res){
            if(err){
              throw err;
            }
            if(res.ok==1 && res.nModified==1){
              Monitor.find({mainRPiID:socket.mainRPiID},function(err,docs){
                if(err){
                  throw err;
                }
                for(var i=0;i<docs.length;i++){
                  if(docs[i].status){
                    Monitor.update({monitorID:docs[i].monitorID},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
                      if(err){
                        throw err;
                      }
                      userArrays.users[userIndex].emit('monitorDisconnect',{mainRPiID:docs[0].monitorID});
                    });
                  }
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
      
    }
  });
};