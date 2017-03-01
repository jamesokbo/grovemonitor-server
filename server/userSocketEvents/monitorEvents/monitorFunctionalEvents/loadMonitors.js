var mongoose=require('mongoose');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('loadMonitors',function(data,fn){
        Monitor.find({mainRPiID:data.mainRPiID},function(err,docs){
          if(err){
            throw err;
          }
          fn(null,docs);
        });
      });
};