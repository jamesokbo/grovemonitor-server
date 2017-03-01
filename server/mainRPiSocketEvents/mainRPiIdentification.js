var mongoose=require('mongoose');
var MainRPi=require('../models/mainRPi.js');
var mainRPiArrays=require('../mainRPiArrays.js');
var errors=require('../errors.js');

module.exports=function(socket){
  socket.on('mainRPiIdentification',function(data, fn){
       if(data.mainRPiID!='' && data.mainRPiID!=null){
        socket.mainRPiID=mongoose.Types.ObjectId(data.mainRPiID);
        
        if(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString())!=-1){
          mainRPiArrays.mainRPis[mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString())].disconnect();
          mainRPiArrays.mainRPis.splice(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
          mainRPiArrays.mainRPiIDs.splice(mainRPiArrays.mainRPiIDs.indexOf(socket.mainRPiID.toString()),1);
        }
    
        MainRPi.find({_id:socket.mainRPiID},function(err,docs){
          if(err){
            throw err;
          }
          if(docs.length!=0){
            MainRPi.update({_id:socket.mainRPiID},{$set:{status:true, lastConnection:Date.now()}},function(err,res){
              if(err){
                throw err;
              }
              if(res.ok==1 && res.nModified==1){
                mainRPiArrays.mainRPiIDs.push(socket.mainRPiID.toString());
                mainRPiArrays.mainRPis.push(socket);
                console.log('mainRPi '+ socket.mainRPiID+' has succesfully been identified');
                console.log('mainRPiIDs length: '+ mainRPiArrays.mainRPiIDs.length+',mainRPis length: '+mainRPiArrays.mainRPis.length);
                fn(null,{status:true});
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
        var mainRPi=new MainRPi();
        mainRPi.save(function(err,mon){
          if(err){
            throw err;
          }
          MainRPi.update({_id:mon._id},{$set:{mainRPiID:mon._id}},function(err,res){
            if(err){
              throw err;
            }
            fn(null,{status:true, new: true, mainRPiID:mon._id});
          });
        });
      }
  });
};