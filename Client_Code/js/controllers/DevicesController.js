'use strict';

adminConsoleApp.controller('DevicesController',
    function DevicesController ($scope, dataManager, viewManager, $http) {
        $scope.devices = dataManager.dataDevices;
        $scope.currentDevice = null;
        $scope.currentIndex = -1;
        $scope.addDevice = function () {
            $scope.currentDevice = new dataManager.Device();
            viewManager.showPopup('devices', $scope);
        };
        $scope.saveData = function () {
            $scope.currentDevice.$save();
            $scope.devices.push($scope.currentDevice);
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
            $scope.devices.splice($scope.currentIndex, 1);
        };
        $scope.cancelSave = function () {

        };
        $scope.changeCurrentDevice = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
    }
);