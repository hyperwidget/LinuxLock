'use strict';

adminConsoleApp.controller('HeaderController',
    function HeaderController ($scope, dataManager) {
       $scope.navbarItems = dataManager.Permissions.query();
    }
);

$(function(){

  $('.logout').click(function(){
    window.location = 'logout';
  });

});