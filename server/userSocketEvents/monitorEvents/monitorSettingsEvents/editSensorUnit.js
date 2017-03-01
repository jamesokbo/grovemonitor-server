var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('editSensorUnit',function(data,fn){
        var setUnit={};
        var setUnitString=data.sensor+'.unit';
        setUnit[setUnitString]=data.newUnit;
        
        Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                Monitor.update({monitorID:data.monitorID},
                {$set:setUnit},function(err,doc){
                    if(err){
                        throw err;
                    }
                    console.log(doc);
                    fn(null,{status:true});
                });
            }
            else{
                fn(null,errors.s007);
            }
        });
    });
};