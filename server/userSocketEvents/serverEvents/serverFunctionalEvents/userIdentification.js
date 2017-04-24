var mongoose=require('mongoose');
var User=require('../../../models/user.js');
var userArrays=require('../../../userArrays.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
  socket.on('userIdentification',function(data, fn){
    if(data.userID!='' && data.userID!=null){
    socket.userID=mongoose.Types.ObjectId(data.userID);
    
    if(userArrays.userIDs.indexOf(socket.userID.toString())!=-1){
        fn(errors.s012);
        socket.disconnect();
    }
    else{
      User.find({_id:socket.userID},function(err,docs){
        if(err){
          throw err;
        }
        if(docs.length!=0){
          userArrays.userIDs.push(socket.userID.toString());
          userArrays.users.push(socket);
          fn(null,{status:true});
        }
        //Not found in our database 
        else{
          fn(errors.s011);
          socket.disconnect();
        }
      });
    }
  }
});
};