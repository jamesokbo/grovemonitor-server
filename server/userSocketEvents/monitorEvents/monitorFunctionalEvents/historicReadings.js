var Reading=require('../../../models/reading.js');
var errors=require('../../../errors.js');

module.exports=function(socket){
  socket.on('historicReadings', function(data,fn){
    console.log('requested historic readings for the following data: '+data);
    var fromDate= new Date(data.fromDate);
    var toDate= new Date(data.toDate);
    fromDate=fromDate.getTime();
    toDate=toDate.getTime();
      
    Reading.find({'mainRPiID':data.mainRPiID, 'monitorID':data.monitorID, 'type':data.type, 'date':{$gte:fromDate, $lte:toDate}})
    .sort({'date':1}).exec(function(err,docs){
      if(err){
        throw err;
      }
      if(docs.length!=0){
        fn(null,docs);    
      }
      else{
        console.log('No historic readings of that sensor');
        fn(errors.s006);
      }
    });
  });
};