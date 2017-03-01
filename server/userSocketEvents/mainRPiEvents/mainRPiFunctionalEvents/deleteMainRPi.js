var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('deleteMainRPi',function(data,fn){
        //TODO: this should be a part of the callback, after the mainRPis UserID and name are deleted physically
        MainRPi.update({mainRPiID:mongoose.Types.ObjectId(data.mainRPiID), userID:data.userID},
        {$set:{userID:"",name:""}},function(err,res){
            if(err){
                throw err;
            }
            if(res.ok==1 && res.nModified==1){
                fn(null,{status:true});
            }
            else{
                fn(errors.s004);
            }
        });
        
    });
    
}