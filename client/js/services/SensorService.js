myApp.factory('SensorService',
  ['$q', 'Socket',
  function ($q,Socket) {
    var sensors=['aTemp','wTemp','lux','ec','ph','rh','co2','do'];
    var sensorUnits= {
        aTemp:['°C','°F'],
        wTemp:['°C','°F'],
        lux:['lux','fc'],
        ec:['mS'],
        ph:[''],
        rh:['%'],
        co2:['ppm'],
        do:['ppm']
    };
    var calibrationOptions={
        aTemp:[],
        wTemp:[],
        lux:[],
        ec:[],
        ph:[4,7,10],
        rh:[],
        co2:[],
        do:[]
    }
    
    function getSensorUnits(sensor,fn){
        fn(sensorUnits[sensor]);
    }
    function getCalibrationOptions(sensor,fn){
        fn(calibrationOptions[sensor]);
    }
    
    function getConvertedReading(sensor,unit,reading){
        if(sensor=='aTemp'){
            if(unit=='°F'){
                reading=Math.round(((reading*(9/5))+32)*10)/10;
            }
        }
        if(sensor=='wTemp'){
            if(unit=='°F'){
                reading=Math.round(((reading*(9/5))+32)*10)/10;
            }
        }
        if(sensor=='lux'){
            if(unit=='fc'){
                reading=Math.round((reading*0.09290304)*10)/10;
            }
        }
        return reading;
    }
    function getReadingInStandardUnit(sensor,unit,reading){
        if(sensor=='aTemp'){
            if(unit=='°F'){
                reading=Math.round(((reading-32)*(5/9))*10)/10;
            }
        }
        if(sensor=='wTemp'){
            if(unit=='°F'){
                reading=Math.round(((reading-32)*(5/9))*10)/10;
            }
        }
        if(sensor=='lux'){
            if(unit=='fc'){
                reading=Math.round((reading/0.09290304)*10)/10;
            }
        }
        return reading;
    }
    
    // return available functions for use in the controllers
    return ({
        getSensorUnits:getSensorUnits,
        getCalibrationOptions:getCalibrationOptions,
        sensors:sensors,
        getConvertedReading:getConvertedReading,
        getReadingInStandardUnit:getReadingInStandardUnit
    });
}]);