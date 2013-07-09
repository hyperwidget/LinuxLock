'use strict';

adminConsoleApp.factory('dataManager', function () {
    var usersData = 
        $.getJSON('cardHolders')
        /*
    [
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
        ]
        */
        ,
        devicesData = $.getJSON('devices')
        /*[
            { alias: 'Front Door',
                type: 'RFID'
            },
            { alias: 'Back Door',
                type: 'RFID'
            },
            { alias: 'Office Door',
                type: 'RFID'
            }
        ]*/
        ,
        zonesData = $.getJSON('zones')
        /*[
            { alias: 'Public Access',
                devices: 'Front Door'
            },
            { alias: 'Access All',
                devices: 'Front Door, Back Door, Offices'
            },
            { alias: 'Guest Access',
                type: 'Offices'
            }
        ]*/
    ;
    return {
        dataUsers: usersData,
        dataDevices: devicesData,
        dataZones: zonesData
    };
});