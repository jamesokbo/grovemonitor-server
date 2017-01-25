myApp.controller('navController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
    console.log('entered NavController');
    $scope.isLogged=false;
    
    $scope.isActive = function(destination){
        AuthService.isLoggedIn(function(res){
            if(res){
                $scope.isLogged=true;
            }
            else{
                $scope.isLogged=false;
            }
        });
        return destination === $location.path();
    };
    //función para cerrar sesión del usuario
    $scope.logOut=function(){
        console.log("logging out");
        AuthService.logout();
        AuthService.isLoggedIn(function(res){
            if(res){
                $scope.isLogged=true;
            }
            else{
                $scope.isLogged=false;
            }
        });
    };
    
    AuthService.isLoggedIn(function(res){
        if(res){
            $scope.isLogged=false;
        }
        else{
            $scope.isLogged=true;
        }
    });
}]);