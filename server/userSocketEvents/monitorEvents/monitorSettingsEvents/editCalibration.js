var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
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
                    /*TODO: set the boundary on the monitor first, test and move to uBound
                        mainRPiIndex=mainRPiArrays.mainRPiIDs.indexOf(docs[0].mainRPiID);
                        if(mainRPiIndex!=-1){
                            mainRPiArrays.mainRPis[mainRPiIndex].emit('editLBound',data,function(res,err){
                                if(err){
                                    fn(null,err);
                                }
                                if(res.status){
                                    var lBoundString=data.sensor+'.lBound';
                                    var setLBound={};
                                    setLBound[lBoundString]=Number(data.newCalibration);
                                    Monitor.update({_id:data.monitorID},
                                    {$set:setLBound},function(err,doc){
                                        if(err){
                                            throw err;
                                        }
                                        console.log(doc);
                                        fn({status:true});
                                    });
                                }
                            });
                        }
                        */
                    //TODO:borrar esto
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
                        fn({status:true});
                    });  
                    //hasta aquí
                }
                else{
                    fn(null,errors.s009.toString());
                }
            }
            else{
                fn(null,errors.s007.toString());
            }
        });
    });
};