'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($http, $compile, $scope, dataManager, viewManager) {
        $scope.users = dataManager.dataUsers;
        $scope.addUser = function () {
            viewManager.showPopup('users', $scope);
        };
        $scope.saveData = function () {
            $scope.users.push({
                firstName: $scope.newUser.firstName,
                lastName: $scope.newUser.lastName,
                email: $scope.newUser.email,
                phoneNumber: $scope.newUser.phoneNumber,
                cards: $scope.newUser.cards,
                zones: $scope.newUser.zones,
                devices: $scope.newUser.devices
            });
            $scope.resetNewUser();
        };
        $scope.resetNewUser = function () {
            $scope.newUser = {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                cards: '',
                zones: '',
                devices: ''
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewUser();
        };
        $scope.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            cards: '',
            zones: '',
            devices: ''
        };
    }
);