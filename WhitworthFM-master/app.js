var whitworthFM = angular.module('whitworthFM', ['ngRoute','ngResource','ngSanitize','ui.bootstrap','ui.slider'])
    .config(function ($routeProvider, $locationProvider) {

        //Default Route
        $routeProvider.otherwise({ redirectTo: '/home' });

        $routeProvider.when('/home', {
            templateUrl: './templates/pages/home.html',
            controller: 'HomeController'
        }),

        $routeProvider.when('/join', {
            templateUrl: './templates/pages/join.html',
            controller: 'HomeController'
        }),

        $routeProvider.when('/schedule', {
            templateUrl: './templates/pages/schedule.html',
            controller: 'HomeController'
        })

        $locationProvider.html5Mode(true);

    }
);
