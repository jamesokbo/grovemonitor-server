var mongoose=require('mongoose');
var MainRPi=require('../../../models/mainRPi.js');
var mainRPiArrays=require('../../../mainRPiArrays.js');
var Monitor=require('../../../models/monitor.js');
var errors=require('../../../errors.js');
var lowerBoundaries=require('../../../lowerBoundaries.js');
var upperBoundaries=require('../../../upperBoundaries.js');

module.exports=function(socket){
    socket.on('editUBound',function(data,fn){
        console.log("updating upper bound");
         Monitor.find({monitorID:data.monitorID},function(err,docs){
            if(err){
                throw err;
            }
            if(docs.length!=0){
                if(Number(data.newUBound)>lowerBoundaries[data.type] && data.newUBound<upperBoundaries[data.type]){
                    console.log(docs[0][data.type].lBound +"<"+ data.newUBound);
                    if(docs[0][data.type].lBound<data.newUBound){
                        //TODO: set the boundary on the monitor first
                        var uBoundString=data.type+'.UBound';
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