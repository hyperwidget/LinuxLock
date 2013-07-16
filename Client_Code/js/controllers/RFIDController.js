'use strict';

adminConsoleApp.controller('RFIDController',
    function RFIDsController ($scope, dataManager, viewManager) {
        $scope.rfids = dataManager.dataRFIDs;
        $scope.currentRFID = null;
        $scope.currentIndex = -1;
        $scope.addRFID = function () {
            $scope.currentRFID = new dataManager.RFID();
            viewManager.showPopup('rfids', $scope);
        };
        $scope.saveData = function () {
            $scope.currentRFID.$save();
            $scope.rfids.push($scope.currentRFID);
        };
        $scope.editRFID = function () {
            if($scope.currentIndex !== -1){
                $scope.currentRFID =  $scope.rfids[$scope.currentIndex];
                viewManager.showPopup('rfids', $scope);
            }
        };
        $scope.deleteRFID = function() {
            $scope.currentRFID = $scope.rfids[$scope.currentIndex];
            $scope.currentRFID.$delete();
            $scope.rfids.splice($scope.currentIndex, 1);
        };
        $scope.cancelSave = function () {

        };
        $scope.changeCurrentRFID = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByRFIDNo = function(){
            if($scope.rfidNo !== undefined && $scope.rfidNo !== ''){
                $http.get('rfid?rfidNo=' + $scope.rfidNo).success(
                    function(data, status, headers, config){
                        $scope.rfids = data;
                    }
                );
            } else if($scope.rfidNo == '') {
                $http.get('rfid').success(
                    function(data, status, headers, config){
                        $scope.rfids = data;
                    }
                );
            }
        }
        $scope.searchByRFIDStatus = function(){
            if($scope.status !== undefined && $scope.status !== ''){
                $http.get('rfid?status=' + $scope.status).success(
                    function(data, status, headers, config){
                        $scope.rfids = data;
                    }
                );
            } else if($scope.status == '') {
                $http.get('rfid').success(
                    function(data, status, headers, config){
                        $scope.rfids = data;
                    }
                );
            }
        }        
    }
);