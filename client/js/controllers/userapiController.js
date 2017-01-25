myApp.controller('userapiController', ['$scope', 'userApi', function($scope, userApi){
    console.log("entered userapiController");
    $scope.form={};
    $scope.users=[];
    $scope.pageSize=5;
    
    userApi.user.query({}, function(data){
       $scope.users=data; 
    });
    
    $scope.delete=function(index){
        bootbox.confirm("Are you sure you want to delete this user?", function(ans){
            if(ans){
                userApi.user.delete({id: $scope.users[index]._id}, function(data){
                    $scope.users.splice(index,1);  
                    bootbox.alert("User deleted");
                }); 
            }
        });
             
    };
    
}]);