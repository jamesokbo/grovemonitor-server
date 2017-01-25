var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('loadMainRPis',function(data,fn){
        console.log("buscando mainRPis del usuario "+data.userID);
        MainRPi.find({userID:data.userID},function(err,docs){
          if(err){
            throw err;
          }
          fn(docs);
        });
      });
};