'use strict';

adminConsoleApp.controller('ReportsController',
  function ($scope, dataManager, viewManager, $http) {
    $scope.events = dataManager.dataEvents
    $scope.pageSize = 50
    $scope.pageNo = 0
    $scope.totalEntries = 0
    $scope.updateReport = function(filter) {
      // No pagination yet :(
      if(filter) {
        if("from" in filter) $scope.from = filter.from
        if("to" in filter) $scope.to = filter.to
        if("who" in filter) $scope.who = filter.who
        if("dev" in filter) $scope.dev = filter.dev
        if("rfid" in filter) $scope.rfid = filter.rfid
      }
      var params = {
        rfid: $scope.rfid,
        dev: $scope.dev,
        who: $scope.who,
        from: $scope.from,
        to: $scope.to
      }
      //alert(JSON.stringify(params))
      $scope.events = dataManager.Event.query(params)
    }
    $scope.updateReport({from: "Today", to: "Now"})
  }
);