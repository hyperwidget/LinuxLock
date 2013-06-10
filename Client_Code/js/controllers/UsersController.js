'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope) {
        $scope.users = [
            { firstName: 'John',
              lastName: 'Smith',
              email: 'jsmith@company.com',
              phoneNumber: '416 555 1234',
              cards: [10000],
              zones: ['Company - Floor 2', 'Public Areas'],
              devices: ['-']
            },
            { firstName: 'Aaron',
                lastName: 'Rogers',
                email: 'arogers@company.com',
                phoneNumber: '416 555 1111',
                cards: [10001],
                zones: ['Company - Floor 3', 'Public Areas'],
                devices: ['Music Door', 'Random Door']
            },
            { firstName: 'Zachary',
                lastName: 'Gillery',
                email: 'zgillery@company.com',
                phoneNumber: '416 555 2222',
                cards: [10002],
                zones: ['Company - Floor 3', 'Public Areas'],
                devices: ['-']
            },
            { firstName: 'Johnson',
                lastName: 'Phillibrew',
                email: 'jphillibrew@company.com',
                phoneNumber: '416 555 3333',
                cards: [10003],
                zones: ['Company - Main Floor'],
                devices: ['Front Door']
            },
            { firstName: 'Vendra',
                lastName: 'Rangaran',
                email: 'vrangaran@company.com',
                phoneNumber: '416 555 4444',
                cards: [10004],
                zones: ['Public Areas'],
                devices: ['Floor 3 - NW Door']
            },
            { firstName: 'Linda',
                lastName: 'Hopkins',
                email: 'lhopkins@company.com',
                phoneNumber: '416 555 5555',
                cards: [10005],
                zones: ['Company - Main Floor', 'Company - Floor 2', 'Company - Floor 3', 'Public Areas'],
                devices: ['-']
            }
        ];
        $scope.addUser = function () {
            $scope.users.push(
                { firstName: 'Fname' + $scope.users.length,
                    lastName: 'Lname' + $scope.users.length,
                    email: 'email' + $scope.users.length,
                    phoneNumber: $scope.users.length,
                    cards: [10005 + $scope.users.length],
                    zones: ['Company - Main Floor', 'Public Areas'],
                    devices: ['-']
                }
            )
        }
    }
);