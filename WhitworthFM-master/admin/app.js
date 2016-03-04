var admin = angular.module('admin', ['ngRoute','ngResource','ngSanitize'])
    .config(function ($routeProvider, $locationProvider) {

        //Default Route
        $routeProvider.otherwise({ redirectTo: '/wfm-admin/login' });

        $routeProvider.when('/wfm-admin/schedule', {
            templateUrl: '../admin/templates/pages/schedule.html',
            controller: 'ScheduleController'
        });

        $routeProvider.when('/wfm-admin/login', {
            templateUrl: '../admin/templates/pages/login.html',
            controller: 'LoginController'
        });

        $routeProvider.when('/wfm-admin/announcements', {
            templateUrl: '../admin/templates/pages/announcements.html',
            controller: 'AnnouncementsController'
        });


        $locationProvider.html5Mode(true);

    }
);
