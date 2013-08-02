'use strict';

adminConsoleApp.controller('AdminController',
    function AdminsController ($scope, dataManager, viewManager) {
        $scope.admins = dataManager.Admin.query();
        $scope.currentAdmin = null;
        $scope.currentIndex = -1;
        $scope.addAdmin = function () {
            $scope.currentAdmin = new dataManager.Admin();
            viewManager.showPopup('admin', $scope);
        };
        $scope.saveData = function () {
            $scope.currentAdmin.$save();
            $scope.admins = dataManager.Admin.query();
            $scope.hidePopup();
        };
        $scope.editAdmin = function () {
            if($scope.currentIndex !== -1){
                $scope.currentAdmin = $scope.admins[$scope.currentIndex];
                viewManager.showPopup('admin', $scope);
            }
        };
        $scope.deleteAdmin = function() {
            $scope.confirm = confirm('Are you sure you want to delete this admin?');
            if($scope.confirm === true){
                $scope.currentAdmin = $scope.admins[$scope.currentIndex];
                $scope.currentAdmin.$delete();
                $scope.admins = dataManager.Admin.query();
            }
        };
        $scope.changeCurrentAdmin = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByName = function(){
            if($scope.name !== undefined && $scope.name !== ''){
                $scope.admins = dataManager.Admin.query({name: $scope.name});
            } else if($scope.name == '') {
                $scope.admins = dataManager.Admin.query();
            }
        }
        $scope.searchByUserName = function(){
            if($scope.userName !== undefined && $scope.userName !== ''){
                $scope.admins = dataManager.Admin.query({userName: $scope.userName});
            } else if($scope.userName == '') {
                $scope.admins = dataManager.Admin.query();
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