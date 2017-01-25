myApp.controller('signupController', ['$scope', 'Socket', '$location', 'AuthService', function($scope, Socket, $location, AuthService){
    console.log("entered signupController");
    $scope.form={};
    $scope.users=[];
    $scope.pageSize=5;
    $scope.signupErrorMessage='';
    $scope.emailErrorMessage='';
    $scope.nameErrorMessage='';
    $scope.passwordErrorMessage='';
    $scope.signupSuccessMessage='';
    $scope.form.name='';
    $scope.form.email='';
    $scope.form.password='';
    $scope.error=false;
    
    /*
    userApi.user.query({}, function(data){
       $scope.users=data; 
    });
    */
    
    $scope.register=function(){
      // initial values
        $scope.error = false;
        $scope.signupErrorMessage='';
        $scope.emailErrorMessage='';
        $scope.nameErrorMessage='';
        $scope.passwordErrorMessage='';
        $scope.signupSuccessMessage='';
      
        //check if form is valid
        if($scope.form.email=='' || $scope.form.email==undefined){
            $scope.emailErrorMessage='Enter a valid email address: example@example.com';
        }
        if($scope.form.name.length<8){
            $scope.nameErrorMessage='Minimum of 8 characters';
        }
        if($scope.form.password.length<6){
            $scope.passwordErrorMessage='Minimum of 6 characters';
        }
        if($scope.emailErrorMessage=='' && $scope.nameErrorMessage=='' && $scope.passwordErrorMessage==''){
            //If form is valid, call register from service
            console.log('sending this email through socket: '+$scope.form.email);
            Socket.emit('checkEmail',$scope.form,function(res,err){
                if(err){
                    $scope.error = true;
                    $scope.signupErrorMessage = 'Something went wrong...';
                }
                if(res.length==0){ //Email is not taken by anyother user
                    AuthService.register($scope.form.email, $scope.form.name, $scope.form.password)
                    // handle success
                    .then(function () {
                        //$location.path('/login'); /*No need to change path*/
                        AuthService.login($scope.form.name,$scope.form.password)
                        .then(function(){
                           AuthService.verifyEmail()
                           .then(function(){
                              $scope.signupSuccessMessage=$scope.signupSuccessMessage+" Sent Verification Email!"; 
                           })
                           .catch(function(){
                               $scope.signupSuccessMessage=$scope.signupSuccessMessage+" Couldn't send Verification Email!"; 
                           });
                        });
                        $scope.error=false;
                        $scope.signupSuccessMessage='Signed up succesfully!';
                        $scope.signupErrorMessage='';
                        $scope.emailErrorMessage='';
                        $scope.nameErrorMessage='';
                        $scope.passwordErrorMessage='';
                        $scope.form.name = '';
                        $scope.form.email='';
                        $scope.form.password='';
                    })
                    .catch(function () { 
                        $scope.error = true;
                        $scope.signupErrorMessage = "Please check the fields with a warning!";
                        $scope.nameErrorMessage='That username is already taken!';
                        $scope.form.name='';
                        $scope.form.password='';
                    });
                }
                else{ //This means the email is already taken by another user
                    $scope.error = true;
                    $scope.signupErrorMessage = "Please check the fields with a warning!";
                    $scope.emailErrorMessage='That email already belongs to another user!';
                    $scope.form.email='';
                    $scope.form.password='';
                }
            });
            
        }
        else{
            $scope.signupErrorMessage="Please check the fields with a warning";
            $scope.signupSuccessMessage='';
        }
        
    };
    
    /*
    $scope.addToDatabase= function(){
      $scope.signupErrorMessage='';
      $scope.emailErrorMessage='';
      $scope.nameErrorMessage='';
      $scope.passwordErrorMessage='';
      $scope.signupSuccessMessage='';
      
      if($scope.form.email=='' || $scope.form.email==undefined){
        $scope.emailErrorMessage='Enter a valid email address: example@example.com';
      }
      if($scope.form.name.length<8){
        $scope.nameErrorMessage='Minimum of 8 characters';
      }
      if($scope.form.password.length<6){
        $scope.passwordErrorMessage='Minimum of 6 characters';
      }
        
      //Falta validar que el email sí sea un email, y que el username tenga mínimo 8 caracteres
      if($scope.emailErrorMessage=='' && $scope.nameErrorMessage=='' && $scope.passwordErrorMessage==''){
            Socket.emit('userSignup',$scope.form,function(res,err){
                if(err){
                    throw err;
                }
                if(res=='Success'){
                    $scope.signupErrorMessage='';
                    $scope.signupSuccessMessage='You have succesfully signed up!';
                }
                else if(res=='Username taken'){
                    $scope.nameErrorMessage='Sorry but that username is already taken';
                    $scope.signupSuccessMessage='';
                }
                else if(res=='Email taken'){
                    $scope.emailErrorMessage='Sorry but that email address has already signed up';
                    $scope.signupSuccessMessage='';
                }
                else{
                    $scope.signupErrorMessage='Ooops... something weird happened';
                    $scope.signupSuccessMessage='';
                }
            });    
      }
      else{
            $scope.signupErrorMessage="Please check the fields with a warning";
            $scope.signupSuccessMessage='';
      }
    };
    */
}]);