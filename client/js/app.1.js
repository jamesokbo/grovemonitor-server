var myApp=angular.module('myApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'btford.socket-io',
    'chart.js',
    'nvd3'
    ]).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        console.log("entered routeProvider");
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        $routeProvider.when('/', {templateUrl: '/partials/home.html', controller: 'homeController', access: {restricted: false}});
        $routeProvider.when('/home', {templateUrl: '/partials/home.html', controller: 'homeController', access: {restricted: false}});
        $routeProvider.when('/about', {templateUrl: '/partials/about.html', controller: 'aboutController', access: {restricted: false}});
        $routeProvider.when('/contact', {templateUrl: '/partials/contact.html', controller: 'contactController', access: {restricted: false}});
        $routeProvider.when('/login', {templateUrl: '/partials/login.html', controller: 'loginController', access: {restricted: false}});
        $routeProvider.when('/signup', {templateUrl: '/partials/signup.html', controller: 'signupController', access: {restricted: false}});
        $routeProvider.when('/logout', {controller: 'logoutController', access: {restricted: false}});
        $routeProvider.when('/mygroves.1', {templateUrl: '/partials/mygroves.1.html', controller: 'mainRPiApiController', access: {restricted: true}});
        $routeProvider.when('/monitorTest', {templateUrl: '/partials/monitorTest.html', controller: 'monitorTestController', access: {restricted: true}});
        
        //if no valid routes are found, redirect to /home
        $routeProvider.otherwise({redirectTo: '/home'});
        //new comment
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }])
    .filter('startFrom', function(){
        return function(data, start){
            return data.slice(start);
        };
    })
    .run(function ($rootScope, $location, $route, AuthService) {
      $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
          AuthService.getUserStatus()
          .then(function(data){
            AuthService.isLoggedIn(function(res){
              if (next.access.restricted && !res){
                $location.path('/login');
                $route.reload();
              }
            });
          });
      });
    });
    