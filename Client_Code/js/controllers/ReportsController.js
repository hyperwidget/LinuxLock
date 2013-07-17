'use strict';

adminConsoleApp.controller('ReportsController',
  function ($scope, dataManager, viewManager, $http) {
    $scope.events = dataManager.dataEvents
    $scope.pageSize = 50
    $scope.pageNo = 0
    $scope.totalEntries = 0
    $scope.filter = { }
    $scope.update = function(filter) {
      if(!filter) filter = $scope.filter
      if(!("pg" in filter)) filter.pg = $scope.pageNo
      if(!("n") in filter) filter.n = $scope.pageSize
      $scope.filter = filter
      if(data && data.length) url = url + "?" + data

    }

    $scope.setFilter = function(rfidNo, device, startTime, endTime) {
      var filter = {}, data, url = "Reports";
      if(rfidNo && rfidNo instanceof String && rfidNo.length)
        filter.rfid = rfidNo
      if(device && device instanceof String && device.length)
        filter.dev = device
      if(startTime && startTime instanceof Date)
        filter.from = startTime
      if(endTime && endTime instanceof Date)
        filter.to = endTime
      // Update using this filter
      $scope.update(filter)
    }
  }
);