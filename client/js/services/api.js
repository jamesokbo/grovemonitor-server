myApp.factory('userApi',['$resource', function($resource){
    return{
        user: $resource('/userapi/user/:id',{id:'@id'})
    }
}])
.factory('monitorApi',['$resource', function($resource){
    return{
        monitor: $resource('/monitorapi/monitor/:id',{id:'@id'})
    }
}])