var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var ecSchema= mongoose.Schema({
    monitorID:String, /*Monitor al cual está asociada esta lectura de EC*/
    compensated:Boolean,
    reading: Number, /*Lectura del sensor*/
    date: Number, /*Fecha en la que se tomó esta lectura en ms*/
});

module.exports=mongoose.model('ec',ecSchema);