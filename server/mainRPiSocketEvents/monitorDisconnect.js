var Monitor=require('../models/monitor.js');
var MainRPi=require('../models/mainRPi.js');
var userArrays=require('../userArrays.js');
var errors=require('../errors.js');

module.exports=function(socket){
    socket.on('monitorDisconnect',function(data,fn){
        if(data.monitorID!=''){
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
                            fn(null,{status:true});
                        }
                        else{
                            fn(errors.s008);
                        }
                    });
                    MainRPi.find({mainRPiID:docs[0].mainRPiID},function(err,docs){
                        if(err){
                            throw err;
                        }
                        var userIndex=userArrays.userIDs.indexOf(docs[0].userID);
                        if(userIndex!=-1){
                            userArrays.users[userIndex].emit('monitorDisconnect',{monitorID:data.monitorID});
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