'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($http, $compile, $scope, dataManager, viewManager) {
        $scope.users = dataManager.dataUsers;
        $scope.addUser = function () {
            viewManager.showPopup('users');
            $http.get(viewManager.settings['users'].addEditTemplate).success(function(tmplContent) {
                $('.windowContent').html($compile(tmplContent)($scope));
            });

        }
    }
);