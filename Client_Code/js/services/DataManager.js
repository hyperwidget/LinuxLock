'use strict';

adminConsoleApp.factory('dataManager', function ($resource) {
    var User = $resource('cardHolder/:userId', {userId: '@_id'}),
        Device = $resource('device/:deviceId', {deviceId: '@_id'}),
        RFID = $resource('rfid/:rfidId', {rfidId: '@_id'}),
        Event = $resource('events'),
        usersData = User.query(),
        devicesData = Device.query(),
        zonesData = $.getJSON('zones'),
        adminsData = $.getJSON('admins'),
        rfidsData = RFID.query(),
        settingsData = $.getJSON('settings'),
        eventsData = Event.query()
    ;
    return {
        dataDevices: devicesData,
        dataZones: zonesData,
        dataAdmins: adminsData,
        dataRFIDs: rfidsData,
        dataSettings: settingsData,
        dataEvents: eventsData,
        User: User,
        Device: Device,
        RFID: RFID,
        Event: Event,
    };
});
