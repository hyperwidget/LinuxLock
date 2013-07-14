'use strict';

adminConsoleApp.controller('SettingsController',
    function SettingsController ($scope, dataManager) {
        $scope.settings = dataManager.dataSettings;
    }
);