var mongoose=require('mongoose');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('loadMonitor',function(data,fn){
        console.log("buscando monitor "+data.monitorID);
        Monitor.find({_id:data.monitorID},function(err,res){
          if(err){
            throw err;
          }
          console.log(res);
          fn(res[0]);
        });
      });
};