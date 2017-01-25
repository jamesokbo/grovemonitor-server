var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var readingSchema= mongoose.Schema({
	mainRPiID:String,
	monitorID:String,
	status: Boolean,
	type:String, //Value: 'ph','ec', 'wTemp', 'wLevel', 'do', 'aTemp', 'rh', 'lux', 'co2'
	compensated:{type:Boolean,default:false}, 
	reading:{type:Number,default:0}, 
	date:{type:Number,default:Date.now()}
});

module.exports=mongoose.model('Reading',readingSchema);