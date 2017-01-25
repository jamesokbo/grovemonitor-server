var Monitor=require('../models/monitor.js');
var errors=require('../errors.js');
var async=require('async');

module.exports=function(socket){
    socket.on('connectedMonitors',function(data,fn){
        var i=0;
        var resArray=[];
        async.whilst(function(){return i<data.monitorIDs.length}, function(){
            Monitor.find({monitorID:data.monitorIDs[i]},function(err,doc){
                if(err){
                    throw err;
                }
                if(doc.length!=0){ 
                    Monitor.update({monitorID:data.monitorIDs[i]},{$set:{status:true}},function(err,res){
                        if(err){
                            throw err;
                        }
                        resArray[i]={status:true};
                    });
                }
                else{
                    resArray[i]={status:false, error:errors.s007};
                }
            });
        } 
        , function(){
                fn(resArray);
        });
    });
};