myApp.controller('carouselController', function ($scope) {
    console.log("entered carouselController")
    $scope.myInterval = 5000;
    $scope.active = 0;
    var slides = $scope.slides = [{
        image: '/img/background1.jpg',
        id:0
    },
    {
        image: '/img/background2.jpg',
        id:1
    },
    {
        image: '/img/background3.jpg',
        id:2
    }
    ];
});