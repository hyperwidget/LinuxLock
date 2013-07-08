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
            })
        $routeProvider.when('/Reports',
            {
                templateUrl: 'templates/reports.html',
                controller: 'ReportsController'
            })
        $routeProvider.when('/Admin',
            {
                templateUrl: 'templates/admin.html',
                controller: 'AdminController'
            })
        $routeProvider.when('/Settings',
            {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsController'
            })
    });