var mongoose=require('mongoose');
var timeoutCallback=require('timeout-callback');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
var constants=require('../../../constants.js');
var lowerBoundaries=require('../../../lowerBoundaries.js');
var upperBoundaries=require('../../../upperBoundaries.js');

module.exports=function(socket){
    socket.on('editCalibration',function(data,fn){
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                if(Number(data.newCalibration)>lowerBoundaries[data.sensor] && data.newCalibration<upperBoundaries[data.sensor]){
                        var mainRPiIndex=mainRPiArrays.mainRPiIDs.indexOf(docs[0].mainRPiID);
                        console.log(mainRPiIndex);
                        if(mainRPiIndex!=-1){
                            mainRPiArrays.mainRPis[mainRPiIndex].emit('editCalibration',data,
                            timeoutCallback(constants.MAINRPI_TIMEOUT,function(err,res){
                                if(err){
                                    fn(err);
                                }
                                if(res.status){
                                    var newCalString=data.sensor+'.calibration.'+data.calibrationPoint+'.value';
                                    var newCalDate=data.sensor+'.calibration.'+data.calibrationPoint+'.date';
                                    var setNewCal={};
                                    setNewCal[newCalString]=Number(data.newCalibration);
                                    setNewCal[newCalDate]=Date.now();
                                    Monitor.update({_id:data.monitorID},
                                    {$set:setNewCal},function(err,doc){
                                        if(err){
                                            throw err;
                                        }
                                        fn(null,{status:true});
                                    });  
                                }
                            }));
                        }
                        else{
                            fn(errors.s008.toString());        
                        }
                    //TODO:borrar esto
                    //hasta aquí
                }
                else{
                    fn(errors.s009.toString());
                }
            }
            else{
                fn(errors.s007.toString());
            }
        });
    });
};