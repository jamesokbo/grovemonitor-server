module.exports=function(socket){
    socket.on('message',function(data,fn){
        console.log(data.message);
        fn({message:'hello to you'});
    });
};