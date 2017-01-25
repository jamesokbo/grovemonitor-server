var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var monArrays=require('../../../monitorArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('changeReservoirSize',function(data,fn){
        if(monArrays.monitorIDs.indexOf(data.mainRPiID.toString())!=-1){
            monArrays.monitors[monArrays.monitorIDs.indexOf(data.mainRPiID.toString())].emit('changeReservoirSize',data,function(err,res){
                if(err){
                    fn(err);
                }
                Monitor.update({monitorID:res.monitorID},
                {$set:{'resSize.height':data.height, 'resSize.area':data.area}},function(err,doc){
                    if(err){
                        throw err;
                    }
                    fn(res);
                });
                
            });
        }
        else{
            Monitor.find({monitorID:data.monitorID},function(err,docs){
                if(err){
                    throw err;
                }
                if(docs.length!=0){
                    fn(errors.s003);
                }
                else{
                    fn(errors.s001);
                }
            });
        }
    });
};