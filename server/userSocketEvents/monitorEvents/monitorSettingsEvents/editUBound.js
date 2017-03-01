var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
var lowerBoundaries=require('../../../lowerBoundaries.js');
var upperBoundaries=require('../../../upperBoundaries.js');

module.exports=function(socket){
    socket.on('editUBound',function(data,fn){
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                if(data.newUBound>lowerBoundaries[data.sensor] && data.newUBound<upperBoundaries[data.sensor]){
                    if(docs[0][data.sensor].lBound<data.newUBound){
                        /*TODO: set the boundary on the monitor first, test and move to uBound
                        mainRPiIndex=mainRPiArrays.mainRPiIDs.indexOf(docs[0].mainRPiID);
                        if(mainRPiIndex!=-1){
                            mainRPiArrays.mainRPis[mainRPiIndex].emit('editUBound',data,function(res,err){
                                if(err){
                                    fn(null,err);
                                }
                                if(res.status){
                                    var uBoundString=data.sensor+'.uBound';
                                    var setUBound={};
                                    setUBound[uBoundString]=Number(data.newUBound);
                                    Monitor.update({_id:data.monitorID},
                                    {$set:setUBound},function(err,doc){
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
                        var uBoundString=data.sensor+'.uBound';
                        var setUBound={};
                        setUBound[uBoundString]=Number(data.newUBound);
                        Monitor.update({_id:data.monitorID},
                        {$set:setUBound},function(err,doc){
                            if(err){
                                throw err;
                            }
                            fn(null,{status:true});
                        });  
                        //hasta aquí
                    }
                    else{
                        fn(errors.s010.toString());
                    }
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