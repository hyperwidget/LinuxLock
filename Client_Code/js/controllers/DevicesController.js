'use strict';

adminConsoleApp.controller('DevicesController',
    function DevicesController ($scope, dataManager, viewManager) {
        $scope.devices = dataManager.dataDevices;
        $scope.addDevice = function () {
            viewManager.showPopup('devices', $scope);
        };
        $scope.saveData = function () {
            $scope.devices.push({
                alias: $scope.newDevice.alias,
                type: $scope.newDevice.type
            });
            $scope.resetNewDevice();
        };
        $scope.resetNewDevice = function () {
            $scope.newDevice = {
                alias: '',
                type: ''
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewDevice();
        };
        $scope.newDevice = {
            alias: '',
            type: ''
        };
    }
);