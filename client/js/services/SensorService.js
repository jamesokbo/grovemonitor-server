myApp.factory('SensorService',
  ['$q', 'Socket',
  function ($q,Socket) {
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
    
    var sensors=['aTemp','wTemp','lux','ec','ph','rh','co2','do'];
    
    function getSensorUnits(sensor,fn){
        fn(sensorUnits[sensor]);
    }
    
    function getConvertedReading(sensor,unit,reading){
        if(sensor=='aTemp'){
            if(unit=='°F'){
                reading=Math.round((reading*(9/5))+32);
            }
        }
        if(sensor=='wTemp'){
            if(unit=='°F'){
                reading=(reading.reading-32)*(5/9);
            }
        }
        if(sensor=='lux'){
            if(unit=='fc'){
                reading=Math.round(reading*0.09290304);
            }
        }
        return reading;
    }
    
    // return available functions for use in the controllers
    return ({
        getSensorUnits:getSensorUnits,
        sensors:sensors,
        getConvertedReading:getConvertedReading
    });
}]);