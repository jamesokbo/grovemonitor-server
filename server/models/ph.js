var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var phSchema= mongoose.Schema({
    status:Boolean,
	monitorID:String, 
	compensated:Boolean, 
	reading:Number, 
	date:Number,
	error:String
});

module.exports=mongoose.model('Ph',phSchema);