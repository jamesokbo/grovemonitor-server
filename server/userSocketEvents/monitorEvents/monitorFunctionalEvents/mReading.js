var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('mReading',function(data,fn){
        console.log(data);
        fn(null,{status:'warning' ,reading:120, date:Date.now()});
        /*
        if(monArrays.monitorIDs.indexOf(data.mainRPiID.toString())!=-1){
            monArrays.monitors[monArrays.monitorIDs.indexOf(data.mainRPiID.toString())].emit('mReading',data,function(err,res){
                if(err){
                    fn(err);
                }
                if(res.status){
                    var setReading={};
                    var setDate={};
                    var lastReadingString=res.type+'.lastReading';
                    var lastDateString=res.type+'.lastDate';
                    
                    setReading[lastReadingString]=res.reading;
                    setDate[lastDateString]=res.date;
                    Monitor.update({monitorID:res.monitorID},
                    {$set:{setReading, setDate}},function(err,doc){
                        if(err){
                            throw err;
                        }
                        fn(res);
                    });
                }
                else{
                    var setStatus={};
                    var statusString=res.type+'.status';
                    setStatus[statusString]=res.status;
                    
                    Monitor.update({monitorID:res.monitorID},
                    {$set:{setStatus}},function(err,doc){
                        if(err){
                            throw err;
                        }
                        fn(errors.s002);
                    });
                }
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
        */
    });
};