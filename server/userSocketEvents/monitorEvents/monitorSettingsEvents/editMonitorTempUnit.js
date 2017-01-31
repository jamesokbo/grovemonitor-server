var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('editMonitorTempUnit',function(data,fn){
        console.log("updating monitor tempUnit");
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                Monitor.update({_id:data.monitorID},
                {$set:{tempUnit:data.newUnit}},function(err,doc){
                    if(err){
                        throw err;
                    }
                    console.log(doc);
                    fn({status:true});
                });
            }
            else{
                fn(null,errors.s007);
            }
        });
    });
};