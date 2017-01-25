var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('addMainRPi',function(data,fn){
        //TODO: This has to be on the callback after the mainRPi gets its user asigned physically
        MainRPi.update({mainRPiID:mongoose.Types.ObjectId(data.mainRPiID), userID:""},
        {$set:{name:data.name, userID:data.userID}},function(err,res){
            if(err){
                throw err;
            }
            console.log(res);
            if(res.ok==1 && res.nModified==1){
                fn({status:true});
            }
            else{
                fn(errors.s007);
            }
        });
        
    });
    
};