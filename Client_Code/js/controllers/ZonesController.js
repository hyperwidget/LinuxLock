'use strict';

adminConsoleApp.controller('ZonesController',
    function ZonesController ($scope, dataManager, viewManager) {
        var setAddDeviceDisabled = function (newValue) {
            if(newValue !== null){
                var found = false;
                if ($scope.currentZone != null) {
                    angular.forEach($scope.currentZone.devices, function(v, k) {
                        if (v.device_id == newValue._id) found = true;
                    });
                }
                $scope.isAddDeviceDisabled = found;
            }
        };

        $scope.isAddDeviceDisabled = true;
        $scope.isRemoveDeviceDisabled = true;
        $scope.selectedDeviceToAdd = null;
        $scope.selectedDeviceToRemove = null;

        $scope.zones = dataManager.Zone.query();
        $scope.devices = dataManager.Device.query();
        $scope.currentZone = null;
        $scope.currentIndex = -1;
        $scope.addZone = function () {
            if ($scope.devices.length) $scope.selectedDeviceToAdd = $scope.devices[0];
            $scope.currentZone = new dataManager.Zone();
            if($scope.currentZone.devices !== undefined) {
                $scope.selectedDeviceToRemove = $scope.currentZone.devices[0];
            }
            viewManager.showPopup('zones', $scope);
        };
        $scope.saveData = function () {
            $scope.currentZone.$save();
            $scope.zones = dataManager.Zone.query();
            $scope.selectedDeviceToAdd = null;
            $scope.selectedDeviceToRemove = null;
        };
        $scope.cancelSave = function () {
            $scope.selectedDeviceToAdd = null;
            $scope.selectedDeviceToRemove = null;
        }
        $scope.editZone = function () {
            if($scope.currentIndex !== -1){
                if ($scope.devices.length) $scope.selectedDeviceToAdd = $scope.devices[0];
                $scope.currentZone = $scope.zones[$scope.currentIndex];
                if($scope.currentZone.devices !== undefined) {
                    $scope.selectedDeviceToRemove = $scope.currentZone.devices[0];
                }
                viewManager.showPopup('zones', $scope);
            }
        };
        $scope.deleteZone = function() {
            $scope.confirm = confirm('Are you sure you want to delete this zone?');
            if($scope.confirm === true){
                $scope.currentZone = $scope.zones[$scope.currentIndex];
                $scope.currentZone.$delete();
                $scope.zones = dataManager.Zone.query();
            }
        };
        $scope.changeCurrentZone = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByZoneAlias = function(){
            if($scope.alias !== undefined && $scope.alias !== ''){
                $scope.zones = dataManager.Zone.query({name: $scope.alias});
            } else if($scope.alias == '') {
                $scope.zones = dataManager.Zone.query();
            }
        }
        $scope.searchByDevice = function(){
            if($scope.device !== undefined && $scope.device !== ''){
                $scope.zones = dataManager.Zone.query({device: $scope.device._id});
            } else if($scope.device == '') {
                $scope.zones = dataManager.Zone.query();
            }
        }
        $scope.addDevice = function () {
            if($scope.currentZone.devices !== undefined){
                $scope.currentZone.devices.push({ device_id: $scope.selectedDeviceToAdd._id, name: $scope.selectedDeviceToAdd.name });
            } else {
                $scope.currentZone.devices = [];
                $scope.currentZone.devices.push({ device_id: $scope.selectedDeviceToAdd._id, name: $scope.selectedDeviceToAdd.name });
            }
            if ($scope.currentZone.devices && $scope.currentZone.devices.length == 1) $scope.selectedDeviceToRemove = $scope.currentZone.devices[0];
            setAddDeviceDisabled($scope.selectedDeviceToAdd);
        };
        $scope.removeDevice = function () {
            var idx = -1;
            var i = 0;
            var devices = $scope.currentZone.devices;
            while (idx == -1 && i < devices.length)
                if (devices[i].device_id == $scope.selectedDeviceToRemove.device_id) idx = i;
            if (idx > -1) devices.splice(idx, 1);
            $scope.selectedDeviceToRemove = null;
            setAddDeviceDisabled($scope.selectedDeviceToAdd);
        };
        $scope.$watch('selectedDeviceToAdd', function (newValue, oldValue) {
            setAddDeviceDisabled(newValue);
        });
        $scope.$watch('selectedDeviceToRemove', function (newValue, oldValue) {
            $scope.isRemoveDeviceDisabled = newValue == null;
        });
    }
);