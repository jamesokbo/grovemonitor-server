var mongoose=require('../../mongoose');
var Monitor=require('../models/monitor.js');
var monArrays=require('../monitorArrays.js');
var errors=require('../errors.js');

module.exports=function(socket){
  socket.on('monitorIdentification',function(data, fn){
       if(data.monitorID!='' && data.monitorID!=null){
        Monitor.find({_id:data.monitorID},function(err,docs){
          if(err){
            throw err;
          }
          if(docs.length!=0){
            Monitor.update({_id:data.monitorID},{$set:{status:true, lastConnection:Date.now()}},function(err,res){
              if(err){
                throw err;
              }
              console.log(res.ok+' '+res.nModified);
              if(res.ok==1 && res.nModified==1){
                fn({status:true});
              }
            });
          }
          //Si no se encuentra en la base datos se 
          else{
            fn(errors.s001);
            socket.disconnect();
          }
        });
      }
      //Si el ID está vacío, es un monitor nuevo y se le debe asignar ID nuevo
      else{
        Monitor.save(function(err,mon){
          if(err){
            throw err;
          }
          Monitor.update({_id:mon._id},{$set:{monitorID:mon._id}},function(err,res){
            if(err){
              throw err;
            }
            fn({status:true, new: true, monitorID:mon._id});
          });
        });
      }
  });
};