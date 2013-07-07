'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager) {
        $scope.users = dataManager.dataUsers;
        $scope.addUser = dataManager.addUsers;
    }
);