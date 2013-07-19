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
        $scope.searchByFirstName = function(){
            if($scope.first !== undefined && $scope.first !== ''){
                $http.get('cardHolder?first=' + $scope.first).success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            } else if($scope.first == '') {
                $http.get('cardHolder').success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            }
        }
        $scope.searchByLastName = function(){
            if($scope.last !== undefined && $scope.last !== ''){
                $http.get('cardHolder?last=' + $scope.last).success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            } else if($scope.last == '') {
                $http.get('cardHolder').success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            }
        }
        $scope.searchByEmail = function(){
            if($scope.email !== undefined && $scope.email !== ''){
                $http.get('cardHolder?email=' + $scope.email).success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            } else if($scope.email == '') {
                $http.get('cardHolder').success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            }
        }
        $scope.searchByPhone = function(){
            if($scope.phone !== undefined && $scope.phone !== ''){
                $http.get('cardHolder?phone=' + $scope.phone).success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            } else if($scope.phone == '') {
                $http.get('cardHolder').success(
                    function(data, status, headers, config){
                        $scope.users = data;
                    }
                );
            }
        }      
    }
);