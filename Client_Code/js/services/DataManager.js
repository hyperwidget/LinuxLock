'use strict';

adminConsoleApp.factory('dataManager', function ($resource) {
    var User = $resource('cardHolder/:userId', {userId: '@_id'}),
    Device = $resource('device/:deviceId', {deviceId: '@_id'}),
    RFID = $resource('rfid/:rfidId', {rfidId: '@_id'}),
        usersData = User.query(),
        devicesData = Device.query(),
        zonesData = $.getJSON('zones'),
        adminsData = $.getJSON('admins'),
        rfidsData = RFID.query(),
        settingsData = $.getJSON('settings')
    ;
    return {
        dataUsers: usersData,
        dataDevices: devicesData,
        dataZones: zonesData,
        dataAdmins: adminsData,
        dataRFIDs: rfidsData,
        dataSettings: settingsData,
        User: User,
        Device: Device,
        RFID: RFID
    };
});