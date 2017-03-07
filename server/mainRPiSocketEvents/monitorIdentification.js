var mongoose=require('mongoose');
var Monitor=require('../models/monitor.js');
var mainRPiArrays=require('../mainRPiArrays.js');
var errors=require('../errors.js');

module.exports=function(socket){
  socket.on('monitorIdentification',function(data, fn){
       if(data.monitorID!='' && data.monitorID!=null){
        Monitor.find({monitorID:data.monitorID, mainRPiID:socket.mainRPiID},function(err,docs){
          if(err){
            throw err;
          }
          if(docs.length!=0){
            Monitor.update({monitorID:data.monitorID, mainRPiID:socket.mainRPiID},{$set:{status:true, lastConnection:Date.now()}},
            function(err,res){
              if(err){
                throw err;
              }
              console.log(res.ok+' '+res.nModified);
              if(res.ok==1 && res.nModified==1){
                
                fn(null,{status:true});
              }
            });
          }
          else{
            //Monitor sent an ID but it is not recognized by the server, this means it wasn't created by the server
            fn(errors.s007.toString());
          }
        });
      }
      //If the ID is empty, server has to assign a new one
      else{
        var monitor= new Monitor();
        monitor.save(function(err,mon){
          if(err){
            throw err;
          }
          Monitor.update({_id:mon._id},{$set:{monitorID:mon._id, mainRPiID:socket.mainRPiID}},function(err,res){
            if(err){
              throw err;
            }
            fn(null,{status:true, new: true, monitorID:mon._id});
          });
        });
      }
  });
};