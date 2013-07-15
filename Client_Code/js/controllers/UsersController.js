'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager, viewManager) {
        $scope.users = dataManager.dataUsers;
        $scope.zones = dataManager.dataZones;
        $scope.currentUser = null;
        $scope.addUser = function () {
            $scope.currentUser = $scope.newUser;
            viewManager.showPopup('users', $scope);
        };
        $scope.editUser = function () {
            viewManager.showPopup('users', $scope);
        };
        $scope.saveData = function () {
            $scope.users.push({
                first: $scope.currentUser.first,
                last: $scope.currentUser.last,
                email: $scope.currentUser.email,
                phone: $scope.currentUser.phone,
                cards: $scope.currentUser.cards,
                zones: $scope.currentUser.zones,
                devices: $scope.currentUser.devices
            });
            $scope.resetNewUser();
        };
        $scope.resetNewUser = function () {
            $scope.newUser = {
                first: '',
                last: '',
                email: '',
                phone: '',
                cards: '',
                zones: '',
                devices: ''
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewUser();
        };
        $scope.newUser = {
            first: '',
            last: '',
            email: '',
            phone: '',
            cards: '',
            zones: '',
            devices: ''
        };
        $scope.changeCurrentUser = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentUser = $scope.users[index];
        };
    }
);