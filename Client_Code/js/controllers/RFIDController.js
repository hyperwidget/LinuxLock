'use strict';

adminConsoleApp.controller('RFIDController',
    function RFIDsController ($scope, dataManager, viewManager) {
        $scope.rfids = dataManager.RFID.query();
        $scope.currentRFID = null;
        $scope.currentIndex = -1;
        $scope.addRFID = function () {
            $scope.currentRFID = new dataManager.RFID();
            $scope.currentRFID.status = 'inactive';
            $scope.currentRFID.isNewCard = true;
            viewManager.showPopup('rfids', $scope);
        };
        $scope.saveData = function () {
            $scope.currentRFID.$save();
            $scope.rfids = dataManager.RFID.query();
            $scope.hidePopup();
        };
        $scope.editRFID = function () {
            if($scope.currentIndex !== -1){
                $scope.currentRFID =  angular.copy($scope.rfids[$scope.currentIndex]);
                $scope.currentRFID.isNewCard = false;
                viewManager.showPopup('rfids', $scope);
            }
        };
        $scope.deleteRFID = function() {
            $scope.confirm = confirm('Are you sure you want to delete this RFID card?');
            if($scope.confirm === true){
                $scope.currentRFID = $scope.rfids[$scope.currentIndex];
                $scope.currentRFID.$delete();
                $scope.rfids = dataManager.RFID.query();
            }
        };
        $scope.changeCurrentRFID = function (event, id) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = viewManager.findByID($scope.rfids, id);
        };
        $scope.searchByRFIDNo = function(){
            if($scope.rfidNo !== undefined && $scope.rfidNo !== ''){
                $scope.rfids = dataManager.RFID.query({rfidNo: $scope.rfidNo});
            } else if($scope.rfidNo == '') {
                $scope.rfids = dataManager.RFID.query();
            }
        }
        $scope.searchByRFIDStatus = function(){
            if($scope.status !== undefined && $scope.status !== ''){
                $scope.rfids = dataManager.RFID.query({status: $scope.status});
            } else if($scope.status == '') {
                $scope.rfids = dataManager.RFID.query();
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