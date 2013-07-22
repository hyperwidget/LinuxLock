'use strict';

adminConsoleApp.controller('ZonesController',
    function ZonesController ($scope, dataManager, viewManager) {
        $scope.zones = dataManager.Zone.query();
        $scope.devices = dataManager.Device.query();
        $scope.currentZone = null;
        $scope.currentIndex = -1;
        $scope.addZone = function () {
            $scope.currentZone = new dataManager.Zone();
            viewManager.showPopup('zones', $scope);
        };
        $scope.saveData = function () {
            $scope.currentZone.$save();
            $scope.zones = dataManager.Zone.query();
        };
        $scope.editZone = function () {
            if($scope.currentIndex !== -1){
                $scope.currentZone =  $scope.zones[$scope.currentIndex];
                viewManager.showPopup('zones', $scope);
            }
        };
        $scope.deleteZone = function() {
            $scope.currentZone = $scope.zones[$scope.currentIndex];
            $scope.currentZone.$delete();
            $scope.zones = dataManager.Zone.query();
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
    }
);