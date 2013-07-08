'use strict';

adminConsoleApp.controller('ZonesController',
    function ZonesController ($scope, dataManager, viewManager) {
        $scope.zones = dataManager.dataZones;
        $scope.addZone = function () {
            viewManager.showPopup('zones', $scope);
        };
        $scope.saveData = function () {
            $scope.zones.push({
                alias: $scope.newZone.alias,
                devices: $scope.newZone.devices
            });
            $scope.resetNewZone();
        };
        $scope.resetNewZone = function () {
            $scope.newZone = {
                alias: '',
                devices: ''
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewZone();
        };
        $scope.newZone = {
            alias: '',
            devices: ''
        };
    }
);