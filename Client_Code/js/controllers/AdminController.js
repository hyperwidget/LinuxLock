'use strict';

adminConsoleApp.controller('AdminController',
    function AdminController ($scope, dataManager, viewManager) {
        $scope.admins = dataManager.dataAdmins;
        $scope.addAdmin = function () {
            viewManager.showPopup('admin', $scope);
        };
        $scope.saveData = function () {
            $scope.admins.push({
                name: $scope.newAdmin.name,
                username: $scope.newAdmin.username,
                password: $scope.newAdmin.password,
                canManageUsers: $scope.newAdmin.canManageUsers,
                canManageDevices: $scope.newAdmin.canManageDevices,
                canManageZones: $scope.newAdmin.canManageZones,
                canGenerateReports: $scope.newAdmin.canGenerateReports,
                canManageBackups: $scope.newAdmin.canManageBackups,
                canManageSettings: $scope.newAdmin.canManageSettings
            });
            $scope.resetNewAdmin();
        };
        $scope.resetNewAdmin = function () {
            $scope.newAdmin = {
                name: '',
                username: '',
                password: '',
                canManageUsers: false,
                canManageDevices: false,
                canManageZones: false,
                canGenerateReports: false,
                canManageBackups: false,
                canManageSettings: false
            }
        };
        $scope.cancelSave = function () {
            $scope.resetNewAdmin();
        };
        $scope.newAdmin = {
            name: '',
            username: '',
            password: '',
            canManageUsers: false,
            canManageDevices: false,
            canManageZones: false,
            canGenerateReports: false,
            canManageBackups: false,
            canManageSettings: false
        };
    }
);