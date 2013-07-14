'use strict';

adminConsoleApp.controller('RFIDController',
    function DevicesController ($scope, dataManager, viewManager) {
        $scope.rfids = dataManager.dataRfids;
        $scope.addRfid = function () {
            viewManager.showPopup('rfids', $scope);
        };
        $scope.saveData = function () {
            $scope.rfids.push({
                rfidNo: $scope.newRfid.rfidNo,
                status: $scope.newRfid.status
            });
            $scope.resetNewRfid();
        };
        $scope.resetNewRfid = function () {
            $scope.newRfid = {
                rfidNo: '',
                status: 'n'
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewRfid();
        };
        $scope.newRfid = {
            rfidNo: '',
            status: 'n'
        };
    }
);