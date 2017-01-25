var mongoose=require('../../mongoose');
var MainRPi=require('../models/mainRPi.js');
var monArrays=require('../monitorArrays.js');
var errors=require('../errors.js');

module.exports=function(socket){
  socket.on('identification',function(data, fn){
       if(data.mainRPiID!='' && data.mainRPiID!=null){
        socket.mainRPiID=mongoose.Types.ObjectId(data.mainRPiID);
    
        MainRPi.find({_id:socket.mainRPiID},function(err,docs){
          if(err){
            throw err;
          }
          if(docs.length!=0){
            MainRPi.update({_id:socket.mainRPiID},{$set:{status:true, lastConnection:Date.now()}},function(err,res){
              if(err){
                throw err;
              }
              console.log(res.ok+' '+res.nModified);
              if(res.ok==1 && res.nModified==1){
                monArrays.mainRPiIDs.push(socket.mainRPiID.toString());
                monArrays.mainRPis.push(socket);
                console.log('monitor '+ socket.mainRPiID+' has succesfully been identified');
                console.log('mainRPiIDs length: '+ monArrays.mainRPiIDs.length+',mainRPis length: '+monArrays.mainRPis.length);
                fn({status:true});
              }
            });
          }
          //Not found in our database 
          else{
            fn(errors.s001);
            socket.disconnect();
          }
        });
      }
      //Si el ID está vacío, es un monitor nuevo y se le debe asignar ID nuevo
      else{ 
        socket.monitor.save(function(err,mon){
          if(err){
            throw err;
          }
          MainRPi.update({_id:mon._id},{$set:{mainRPiID:mon._id}},function(err,res){
            if(err){
              throw err;
            }
            fn({status:true, new: true, mainRPiID:mon._id});
          });
        });
      }
  });
};