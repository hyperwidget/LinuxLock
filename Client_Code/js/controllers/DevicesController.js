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
                type: $scope.newDevice.type,
                hostname: $scope.newDevice.hostname
            });
            $scope.resetNewDevice();
        };
        $scope.resetNewDevice = function () {
            $scope.newDevice = {
                alias: '',
                type: '',
                hostname: ''
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewDevice();
        };
        $scope.newDevice = {
            alias: '',
            type: '',
            hostname: ''
        };
    }
);