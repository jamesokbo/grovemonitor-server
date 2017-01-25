myApp.controller('loginController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
    console.log("entered loginController");
    $scope.logInErrorMessage='';
    $scope.logInSuccessMessage='';
    $scope.form={};
    $scope.form.username='';
    $scope.form.password='';
    $scope.hideForm=false;
    
    $scope.login = function () {
        // initial values
        $scope.error = false;
        $scope.disabled = true;
        console.log($scope.form.username+' '+ $scope.form.password);
        // call login from service
        AuthService.login($scope.form.username, $scope.form.password)
            // handle success
        .then(function () {
            //$location.path('/');
            $scope.disabled = false;
            $scope.logInErrorMessage='';
            $scope.logInSuccessMessage='Logged in succesfully!';
            $scope.form.username='';
            $scope.form.password='';
            $scope.hideForm=true;
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.logInErrorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
          $scope.form.username='';
          $scope.form.password='';
        });
    };
    
    AuthService.isLoggedIn(function(res){
        if(res){
            $scope.hideForm=true;
            AuthService.getCurrentUser(function(data){
                $scope.logInSuccessMessage='Logged in as: '+data.username;
            });
        }
        else{
            $scope.hideForm=false;
        }
    });
}]);