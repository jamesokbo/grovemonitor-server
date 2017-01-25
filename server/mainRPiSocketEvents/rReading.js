var Reading=require('../models/reading.js');
var Monitor=require('../models/monitor.js');
var errors=require('../errors.js');


module.exports=function(socket){
    socket.on('rReading',function(data,fn){
        Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                if(data.status){
                    Reading.save(data, function(err,res){
                        if(err){
                            throw err;
                        }
                        var setReading={};
                        var setDate={};
                        var lastReadingString=data.type+'.lastReading';
                        var lastDateString=data.type+'.lastDate';
                        
                        setReading[lastReadingString]=data.reading;
                        setDate[lastDateString]=data.date;
                        Monitor.update({monitorID:data.monitorID},
                        {$set:{setReading, setDate}},function(err,doc){
                            if(err){
                                throw err;
                            }
                            fn({status:true});
                        });
                    });   
                }
                else{
                    var setStatus={};
                    var statusString=data.type+'.status';
                    setStatus[statusString]=data.status;
                    
                    Monitor.update({monitorID:data.monitorID},
                        {$set:{setStatus}},function(err,doc){
                            if(err){
                                throw err;
                            }
                            fn({status:true});
                    });
                }
            }
            else{
                fn(errors.s001);
            }
        });    
    });
};