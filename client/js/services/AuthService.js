myApp.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // create user variable
    var user = null;
    
    //Funciones de autentificación    
    function isLoggedIn(fn) {
      if(user) {
        fn(true);
      } else {
        fn(false);
      }
    }
    function login(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post('/login',
        {username: username, password: password})
        // handle success
        .then(function (data) {
          console.log(data);
          if(data.status === 200 && data.data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        }, function (data) {
          user = false;
          deferred.reject();
        });
    
        // return promise object
        return deferred.promise;
    
    }
    function logout() {
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a get request to the server
        $http.get('/logout')
        // handle success
        .then(function (data) {
            user = false;
            deferred.resolve();
        },function (data) {
          user = false;
          deferred.reject();
        });
        // return promise object
        return deferred.promise;
    }
    function register(email, username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post('/signup',
        {email:email, username: username, password: password})
        // handle success
        .then(function (data) {
          console.log(data);
          if(data.status === 200 && data.data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        },function (data) {
          deferred.reject();
        });
        // return promise object
        return deferred.promise;
    }
    function getUserStatus() {
      return $http.get('/status')
      // handle success
      .then(function (data) {
        if(data.data.status){
          user = true;
        } else {
          user = false;
        }
      }, function (data) {
        user = false;
      });
    }
    function getCurrentUser(fn){
      $http.get('/currentUser')
      //handle success
      .then(function(data){
        console.log("se obtuvo el ID del usuario "+data.data.username);
        fn(data.data);
      }, function(data){
        console.log(data.data);
        fn({});
      });
    }
    function verifyEmail(){
      var deferred = $q.defer();
      $http.get('/verifyEmail')
      //handle success
      .then(function(data){
        console.log("Se mandó el correo con éxito");
        deferred.resolve();
      }, function(data){
        console.log('error: '+ data.data.error);
        deferred.reject();
      });
      
      return deferred.promise;
    }

    // return available functions for use in the controllers
    return ({
      getCurrentUser: getCurrentUser,
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      verifyEmail:verifyEmail,
    });
}]);