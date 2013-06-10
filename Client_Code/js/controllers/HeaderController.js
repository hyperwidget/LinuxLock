'use strict';

adminConsoleApp.controller('HeaderController',
    function HeaderController ($scope) {
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
