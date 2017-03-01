module.exports=function(socket){
    socket.on('message',function(data,fn){
        console.log(data.message);
        fn(null,{message:'hello to you'});
    });
};