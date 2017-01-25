var mongoose=require('mongoose');
var User=require('../../../models/user.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
    socket.on('checkEmail',function(data,fn){
        console.log('check Email: '+data.email);
        User.find({email:data.email}, function(err,docs){
          if(err){
            fn(err);
          }
          fn(docs);
        });
    })
}