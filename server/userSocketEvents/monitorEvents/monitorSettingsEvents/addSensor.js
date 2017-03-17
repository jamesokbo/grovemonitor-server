var mongoose=require('mongoose');
var timeoutCallback=require('timeout-callback');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
var constants=require('../../../constants.js');
var lowerBoundaries=require('../../../lowerBoundaries.js');
var upperBoundaries=require('../../../upperBoundaries.js');

module.exports=function(socket){
    socket.on('addSensor',function(data,fn){
        console.log("adding sensor");
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length==1){
                var mainRPiIndex=mainRPiArrays.mainRPiIDs.indexOf(docs[0].mainRPiID);
                if(mainRPiIndex!=-1){
                    mainRPiArrays.mainRPis[mainRPiIndex].emit('addSensor',data,
                    timeoutCallback(constants.MAINRPI_TIMEOUT,function(err,res){
                        if(err){
                            fn(err);
                        }
                        else{
                            if(res.status){
                                var sensors=docs[0].sensors;
                                sensors.push(data.newSensor);
                                sensors.sort();
                                Monitor.update({_id:data.monitorID},
                                {$set:{'sensors':sensors}},function(err,doc){
                                    if(err){
                                        throw err;
                                    }
                                    fn(null,{status:true});
                                });  
                            }    
                        }
                    }));
                }
                else{
                    fn(errors.s008.toString());        
                }
            }
            else{
                fn(errors.s007.toString());
            }
        });
    });
};