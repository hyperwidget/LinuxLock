'use strict';

adminConsoleApp.controller('DevicesController',
    function DevicesController ($scope, dataManager, viewManager, $http) {
        $scope.devices = dataManager.Device.query();
        $scope.currentDevice = null;
        $scope.currentIndex = -1;
        $scope.addDevice = function () {
            $scope.currentDevice = new dataManager.Device();
            viewManager.showPopup('devices', $scope);
        };
        $scope.saveData = function () {
            $scope.currentDevice.$save();
            $scope.devices = dataManager.Device.query();
        };
        $scope.editDevice = function () {
            if($scope.currentIndex !== -1){
                $scope.currentDevice =  $scope.devices[$scope.currentIndex];
                viewManager.showPopup('devices', $scope);
            }
        };
        $scope.deleteDevice = function() {
            $scope.currentDevice = $scope.devices[$scope.currentIndex];
            $scope.currentDevice.$delete();
            $scope.devices = dataManager.Device.query();
        };
        $scope.changeCurrentDevice = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByDeviceName = function(){
            if($scope.name !== undefined && $scope.name !== ''){
                $scope.devices = dataManager.Device.query({name: $scope.name});
            } else if($scope.name == '') {
                $scope.devices = dataManager.Device.query();
            }
        }
        $scope.searchByDeviceType = function(){
            if($scope.type !== undefined && $scope.type !== ''){
                $scope.devices = dataManager.Device.query({type: $scope.type});
            } else if($scope.type == '') {
                $scope.devices = dataManager.Device.query();
            }
        }
        $scope.searchByHostName = function(){
            if($scope.hostname !== undefined && $scope.hostname !== ''){
                $scope.devices = dataManager.Device.query({hostname: $scope.hostname});
            } else if($scope.hostname == '') {
                $scope.devices = dataManager.Device.query();
            }
        }
    }
);