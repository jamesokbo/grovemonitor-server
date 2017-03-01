module.exports=function(socket){
    socket.on('message',function(data,fn){
        var response={message:'message received'};
        console.log('Monitor '+socket.mainRPiID+': '+data.message);
        fn(null,response);
    });
};