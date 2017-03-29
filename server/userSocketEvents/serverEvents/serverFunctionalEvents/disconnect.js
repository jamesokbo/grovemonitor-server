var userArrays=require('../../../userArrays.js');

module.exports=function(socket){
    socket.on('disconnect',function(data,fn){
        var userIndex=userArrays.userIDs.indexOf(socket.userID.toString());
        if(userIndex!=-1){
          userArrays.users.splice(userIndex,1);
          userArrays.userIDs.splice(userIndex,1);
        }
        socket.disconnect();
    });
};