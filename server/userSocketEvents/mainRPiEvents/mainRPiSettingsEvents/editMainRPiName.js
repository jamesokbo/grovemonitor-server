var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('editMainRPiName',function(data,fn){
        MainRPi.update({mainRPiID:mongoose.Types.ObjectId(data.mainRPiID)},
        {$set:{name:data.newName}},function(err,res){
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