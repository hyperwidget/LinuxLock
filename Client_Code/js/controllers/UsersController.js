'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager, viewManager, $http) {
        var setAddZoneDisabled = function (newValue) {
            var found = false;
            if ($scope.currentUser != null) {
                angular.forEach($scope.currentUser.zones, function(v, k) {
                    if (v.zone_id == newValue._id) found = true;
                });
            }
            $scope.isAddZoneDisabled = found;
        };

        $scope.users = dataManager.User.query();
        $scope.zones = dataManager.Zone.query();
        $scope.currentUser = null;
        $scope.currentIndex = -1;
        $scope.isAddZoneDisabled = true;
        $scope.selectedZoneToAdd = null;
        $scope.selectedZonesToRemove = null;

        $scope.addUser = function () {
            $scope.selectedZoneToAdd = $scope.zones[0];
            $scope.currentUser = new dataManager.User();
            $scope.selectedZonesToRemove = $scope.currentUser.zones[0];
            viewManager.showPopup('users', $scope);
        };
        $scope.editUser = function () {
            if($scope.currentIndex !== -1){
                $scope.selectedZoneToAdd = $scope.zones[0];
                $scope.currentUser =  $scope.users[$scope.currentIndex];
                $scope.selectedZonesToRemove = $scope.currentUser.zones[0];
                viewManager.showPopup('users', $scope);
            }
        };
        $scope.saveData = function () {
            $scope.currentUser.$save();
            $scope.users = dataManager.User.query();
            $scope.selectedZoneToAdd = null;
            $scope.selectedZonesToRemove = null;
        };
        $scope.cancelSave = function () {
            $scope.selectedZoneToAdd = null;
            $scope.selectedZonesToRemove = null;
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
                $scope.users = dataManager.User.query({first: $scope.first});
            } else if($scope.first == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByLastName = function(){
            if($scope.last !== undefined && $scope.last !== ''){
                $scope.users = dataManager.User.query({last: $scope.last});
            } else if($scope.last == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByEmail = function(){
            if($scope.email !== undefined && $scope.email !== ''){
                $scope.users = dataManager.User.query({email: $scope.email});
            } else if($scope.email == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByPhone = function(){
            if($scope.phone !== undefined && $scope.phone !== ''){
                $scope.users = dataManager.User.query({phone: $scope.phone});
            } else if($scope.phone == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByZone = function(){
            console.log($scope.zone._id);
            if($scope.zone !== undefined && $scope.zone !== ''){
                $scope.users = dataManager.User.query({zone: $scope.zone._id});
            } else if($scope.zone == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.addZone = function () {
            $scope.currentUser.zones.push({ zone_id: $scope.selectedZoneToAdd._id, name: $scope.selectedZoneToAdd.name });
            setAddZoneDisabled($scope.selectedZoneToAdd);
        };
        $scope.removeZone = function () {

        };
        $scope.$watch('selectedZoneToAdd', function (newValue, oldValue) {
            setAddZoneDisabled(newValue);
        });

    }
);