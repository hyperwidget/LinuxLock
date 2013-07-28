'use strict';

adminConsoleApp.controller('SettingsController',
    function SettingsController ($scope, dataManager) {
        $scope.settings = dataManager.Setting.query();
        $scope.backupList = dataManager.Backups;
        $scope.frequencyList = ["Weekly", "Monthly", "Daily"];
	    $scope.updateFrequency = function(){
	    	$scope.settings[0].$save();
	    };

	    $scope.updateBackupNumber = function(){
	    	$scope.settings[1].$save();
	    };

	    $scope.executeBackup = function(){
            $scope.confirm = confirm('Warning! Performing this action will result in any data changes since the selected backup being replaced. Continue?');
            if($scope.confirm === true){
            	$scope.reqData = {file : $scope.selectedBackupToExecute};
            	$.ajax({
            		url: 'executeRestore',
            		type: 'POST',
            		data: $scope.reqData
            	});
            } else {
            	alert();
            }
	    };
    }

);