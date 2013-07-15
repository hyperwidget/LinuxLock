'use strict';

adminConsoleApp.factory('dataManager', function () {
    var usersData = 
        $.getJSON('cardHolders')
    /*
    [
            { first: 'John',
                last: 'Smith',
                email: 'jsmith@company.com',
                phone: '416 555 1234',
                cards: [10000],
                zones: ['Company - Floor 2', 'Public Areas'],
                devices: ['-']
            },
            { first: 'Aaron',
                last: 'Rogers',
                email: 'arogers@company.com',
                phone: '416 555 1111',
                cards: [10001],
                zones: ['Company - Floor 3', 'Public Areas'],
                devices: ['Music Door', 'Random Door']
            },
            { first: 'Zachary',
                last: 'Gillery',
                email: 'zgillery@company.com',
                phone: '416 555 2222',
                cards: [10002],
                zones: ['Company - Floor 3', 'Public Areas'],
                devices: ['-']
            },
            { first: 'Johnson',
                last: 'Phillibrew',
                email: 'jphillibrew@company.com',
                phone: '416 555 3333',
                cards: [10003],
                zones: ['Company - Main Floor'],
                devices: ['Front Door']
            },
            { first: 'Vendra',
                last: 'Rangaran',
                email: 'vrangaran@company.com',
                phone: '416 555 4444',
                cards: [10004],
                zones: ['Public Areas'],
                devices: ['Floor 3 - NW Door']
            },
            { first: 'Linda',
                last: 'Hopkins',
                email: 'lhopkins@company.com',
                phone: '416 555 5555',
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
        ,
        adminsData = $.getJSON('admins')
        ,
        rfidsData = $.getJSON('rfids')
        ,
        settingsData = $.getJSON('settings')
    ;
    return {
        dataUsers: usersData,
        dataDevices: devicesData,
        dataZones: zonesData,
        dataAdmins: adminsData,
        dataRfids: rfidsData,
        dataSettings: settingsData
    };
});