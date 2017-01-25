var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var monArrays=require('../../../monitorArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
var lowerBoundaries=require('../../../lowerBoundaries.js');
var upperBoundaries=require('../../../upperBoundaries.js');

module.exports=function(socket){
    socket.on('editLBound',function(data,fn){
        console.log("updating lower bound");
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                if(Number(data.newLBound)>lowerBoundaries[data.type] && data.newLBound<upperBoundaries[data.type]){
                    console.log(docs[0][data.type].uBound +">"+ data.newLBound);
                    if(docs[0][data.type].uBound>data.newLBound){
                        /*TODO: set the boundary on the monitor first, test and move to uBound
                        mainRPiIndex=monArrays.mainRPiIDs.indexOf(docs[0].mainRPiID);
                        if(mainRPiIndex!=-1){
                            monArrays.mainRPis[mainRPiIndex].emit('editLBound',data,function(res,err){
                                if(err){
                                    fn(null,err);
                                }
                                if(res.status){
                                    var lBoundString=data.type+'.lBound';
                                    var setLBound={};
                                    setLBound[lBoundString]=Number(data.newLBound);
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
                        var lBoundString=data.type+'.lBound';
                        var setLBound={};
                        setLBound[lBoundString]=Number(data.newLBound);
                        Monitor.update({_id:data.monitorID},
                        {$set:setLBound},function(err,doc){
                            if(err){
                                throw err;
                            }
                            console.log(doc);
                            fn({status:true});
                        });  
                        //hasta aquí
                    }
                    else{
                        fn(null,errors.s010);
                    }
                }
                else{
                    fn(null,errors.s009);
                }
            }
            else{
                fn(null,errors.s007);
            }
        });
    });
};