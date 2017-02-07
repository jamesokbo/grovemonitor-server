var mongoose=require('mongoose');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('loadMonitors',function(data,fn){
        console.log("buscando monitores del MainRPi "+data.mainRPiID);
        Monitor.find({mainRPiID:data.mainRPiID},function(err,docs){
          if(err){
            throw err;
          }
          fn(docs);
        });
      });
};