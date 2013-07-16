'use strict';

adminConsoleApp.factory('dataManager', function ($resource) {
    var User = $resource('cardHolder/:userId', {userId: '@_id'}),
        usersData = User.query(),
        devicesData = $.getJSON('devices'),
        zonesData = $.getJSON('zones'),
        adminsData = $.getJSON('admins'),
        rfidsData = $.getJSON('rfids'),
        settingsData = $.getJSON('settings')
    ;
    return {
        dataUsers: usersData,
        dataDevices: devicesData,
        dataZones: zonesData,
        dataAdmins: adminsData,
        dataRfids: rfidsData,
        dataSettings: settingsData,
        User: User
    };
});