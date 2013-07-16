'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager, viewManager) {
        $scope.users = dataManager.dataUsers;
        $scope.zones = dataManager.dataZones;
        $scope.currentUser = null;
        $scope.currentIndex = -1;
        $scope.addUser = function () {
            $scope.currentUser = new dataManager.User();
            viewManager.showPopup('users', $scope);
        };
        $scope.editUser = function () {
            $scope.currentUser =  $scope.users[$scope.currentIndex];
                viewManager.showPopup('users', $scope);
        };
        $scope.saveData = function () {
            $scope.currentUser.$save();
            $scope.users.push($scope.currentUser);
        };
        $scope.cancelSave = function () {

        };
        $scope.deleteUser = function() {
            $scope.currentUser = $scope.users[$scope.currentIndex];
            $scope.currentUser.$delete();
            $scope.users.splice($scope.currentIndex, 1);
        };
        $scope.changeCurrentUser = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
    }
);