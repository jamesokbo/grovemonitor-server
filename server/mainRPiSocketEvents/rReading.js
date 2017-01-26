var Reading=require('../models/reading.js');
var Monitor=require('../models/monitor.js');
var errors=require('../errors.js');


module.exports=function(socket){
    socket.on('rReading',function(data,fn){
        var response={savedToServer:false,savedToMainRPi:false};
        
        Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                //The monitor exists in the server's database
                if(data.status){
                    //Save reading if the status of its sensor is true
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
                            response.savedToServer=true;
                            fn({response});
                        });
                    });   
                }
                var setStatus={};
                var statusString=data.type+'.status';
                setStatus[statusString]=data.status;
                    
                Monitor.update({monitorID:data.monitorID},
                    {$set:{setStatus}},function(err,doc){
                        if(err){
                            throw err;
                        }
                        //mainRPi doesn't care if the server succesfully updated the status of the sensor
                    });
                }
            else{
                fn(null,errors.s001);
            }
        });    
    });
};