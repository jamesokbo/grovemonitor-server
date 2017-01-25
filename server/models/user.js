var mongoose = require('mongoose');
var passportLocalMongoose= require('passport-local-mongoose');

var userSchema= mongoose.Schema({
        email: String, /*email del usuario*/
        verified: Boolean,
        newsletter: Boolean
        
   
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);