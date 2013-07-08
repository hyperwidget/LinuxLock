'use strict';

adminConsoleApp.directive('popup', function($compile) {
    return {
        restrict: 'E',
        templateUrl: 'templates/popup',
        replace: true
    };
});