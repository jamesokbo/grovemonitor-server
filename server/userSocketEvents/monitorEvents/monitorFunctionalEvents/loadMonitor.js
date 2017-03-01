var mongoose=require('mongoose');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('loadMonitor',function(data,fn){
        Monitor.find({_id:data.monitorID},function(err,res){
          if(err){
            throw err;
          }
          fn(null,res[0]);
        });
      });
};