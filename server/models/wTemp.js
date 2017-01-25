var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var wTempSchema= mongoose.Schema({
    monitorID:String, /*Monitor al cual está asociada esta lectura de pH*/
    date: Number, /*Fecha en la que se tomó esta lectura*/
    reading: Number /*Lectura del sensor*/
});

module.exports=mongoose.model('wTemp',wTempSchema);