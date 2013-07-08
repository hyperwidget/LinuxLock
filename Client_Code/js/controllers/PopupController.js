'use strict';

adminConsoleApp.controller('PopupController',
    function PopupController ($scope, dataManager, viewManager) {
        $scope.hidePopup = viewManager.hidePopup;
        $scope.saveData = viewManager.saveData;
    }
);