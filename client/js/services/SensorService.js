myApp.factory('SensorService',
  ['$q', 'Socket',
  function ($q,Socket) {
    var sensorUnits= {
        aTemp:['°C','°F'],
        wTemp:['°C','°F'],
        lux:['lux'],
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
    
    // return available functions for use in the controllers
    return ({
        getSensorUnits:getSensorUnits,
        sensors:sensors,
    });
}]);