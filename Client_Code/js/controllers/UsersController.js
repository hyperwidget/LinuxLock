'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager, viewManager, $http) {
        $scope.users = dataManager.User.query();
        $scope.zones = dataManager.dataZones;
        $scope.currentUser = null;
        $scope.currentIndex = -1;

        $scope.addUser = function () {
                $scope.currentUser = new dataManager.User();
                viewManager.showPopup('users', $scope);
        };
        $scope.editUser = function () {
            if($scope.currentIndex !== -1){
                $scope.currentUser =  $scope.users[$scope.currentIndex];
                viewManager.showPopup('users', $scope);
            }
        };
        $scope.saveData = function () {
            $scope.currentUser.$save();
            $scope.users = dataManager.User.query();
        };
        $scope.deleteUser = function() {
            $scope.currentUser = $scope.users[$scope.currentIndex];
            $scope.currentUser.$delete();
            $scope.users = dataManager.User.query();
        };
        $scope.changeCurrentUser = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByFirstName = function(){
            if($scope.first !== undefined && $scope.first !== ''){
                $scope.users = dataManager.User.query({first:  $scope.first});
            } else if($scope.first == '') {
                $scope.users = dataManager.User.query();
            }
        }
        $scope.searchByLastName = function(){
            if($scope.last !== undefined && $scope.last !== ''){
                $scope.users = dataManager.User.query({last:  $scope.last});
            } else if($scope.last == '') {
                $scope.users = dataManager.User.query();
            }
        }
        $scope.searchByEmail = function(){
            if($scope.email !== undefined && $scope.email !== ''){
                $scope.users = dataManager.User.query({email:  $scope.email});
            } else if($scope.email == '') {
                $scope.users = dataManager.User.query();
            }
        }
        $scope.searchByPhone = function(){
            if($scope.phone !== undefined && $scope.phone !== ''){
                $scope.users = dataManager.User.query({phone:  $scope.phone});
            } else if($scope.phone == '') {
                $scope.users = dataManager.User.query();
            }
        }      
    }
);