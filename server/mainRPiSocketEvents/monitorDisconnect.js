var Monitor=require('../models/monitor.js');
var errors=require('../errors.js');

module.exports=function(socket){
    socket.on('monitorDisconnect',function(data,fn){
        if(data.monitorID!=0 && data.monitorID!=null){
            Monitor.find({monitorID:data.monitorID},function(err,docs){
                if(err){
                    throw err;
                }
                if(docs.length!=0){
                    Monitor.update({monitorID:data.monitorID},{$set:{status:false, lastConnection:Date.now()}},function(err,res){
                        if(err){
                            throw err;
                        }
                        if(res.ok==1 && res.nModified==1){
                            fn({status:true});
                        }
                        else{
                            fn(errors.s008);
                        }
                    });
                }
                else{
                    fn(errors.s007);
                }
            });
        }
    });
};