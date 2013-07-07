'use strict';

adminConsoleApp.controller('HeaderController',
    function HeaderController ($scope, dataManager) {
       $scope.navbarItems = [
           { name: 'Users' },
           { name: 'Devices' },
           { name: 'Zones' },
           { name: 'Reports' },
           { name: 'Admin' },
           { name: 'Settings' }
       ];
    }
);

$(function(){

  $('.logout').click(function(){
    window.location = 'logout';
  });

});