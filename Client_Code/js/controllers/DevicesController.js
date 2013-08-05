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
            $scope.hidePopup();
        };
        $scope.editDevice = function () {
            if($scope.currentIndex !== -1){
                $scope.currentDevice =  angular.copy($scope.devices[$scope.currentIndex]);
                viewManager.showPopup('devices', $scope);
            }
        };
        $scope.deleteDevice = function() {
            $scope.confirm = confirm('Are you sure you want to delete this device?');
            if($scope.confirm === true){
                dataManager.Zone.query({device: $scope.devices[$scope.currentIndex]._id}, function(data) {
                    if (data.length > 0) {
                        if (confirm('The device you are about to delete is still a part of 1 or more zones. Do you wish to delete anyway?')) {
                            $scope.currentDevice = $scope.devices[$scope.currentIndex];
                            $scope.currentDevice.$delete();
                            $scope.devices = dataManager.Device.query();
                        }
                    } else {
                        $scope.currentDevice = $scope.devices[$scope.currentIndex];
                        $scope.currentDevice.$delete();
                        $scope.devices = dataManager.Device.query();
                    }
                });
            }
        };
        $scope.changeCurrentDevice = function (event, id) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = viewManager.findByID($scope.devices, id);;
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
        $scope.$watch('currentIndex', function (newValue, oldValue) {
            $scope.isEditButtonDisabled = $scope.isDeleteButtonDisabled = newValue < 0;
        });
        $scope.isAddButtonDisabled = false;
        $scope.isEditButtonDisabled = true;
        $scope.isDeleteButtonDisabled = true;
    }
);