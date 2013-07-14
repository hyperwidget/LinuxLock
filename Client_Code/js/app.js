'use strict';

var adminConsoleApp = angular.module('adminConsoleApp', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/Users',
            {
                templateUrl: 'templates/users',
                controller: 'UsersController'
            });
        $routeProvider.when('/Devices',
            {
                templateUrl: 'templates/devices',
                controller: 'DevicesController'
            });
        $routeProvider.when('/Zones',
            {
                templateUrl: 'templates/zones',
                controller: 'ZonesController'
            });
        $routeProvider.when('/Reports',
            {
                templateUrl: 'templates/reports',
                controller: 'ReportsController'
            });
        $routeProvider.when('/Admin',
            {
                templateUrl: 'templates/admin',
                controller: 'AdminController'
            });
        $routeProvider.when('/Settings',
            {
                templateUrl: 'templates/settings',
                controller: 'SettingsController'
            });
        $routeProvider.when('/Cards',
            {
                templateUrl: 'templates/rfids',
                controller: 'RFIDController'
            })
    });