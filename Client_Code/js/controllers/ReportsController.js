'use strict';

adminConsoleApp.controller('ReportsController',
  function ($scope, dataManager, viewManager, $http) {
    $scope.events = dataManager.dataEvents
    $scope.pageSize = 50
    $scope.pageNo = 0
    $scope.totalEntries = 0
    $scope.filter = { }
    $scope.updateReport = function(filter) {
      // No pagination yet :(
      var params = {
        rfid: $scope.rfid,
        dev: $scope.dev,
        who: $scope.who,
        from: $scope.from,
        to: $scope.to
      }
      $scope.events = dataManager.Event.query(params)
    }
  }
);