'use strict';

adminConsoleApp.factory('dataManager', function ($resource) {
    var User = $resource('cardHolder/:userId', {userId: '@_id'}),
        Device = $resource('device/:deviceId', {deviceId: '@_id'}),
        RFID = $resource('rfid/:rfidId', {rfidId: '@_id'}),
        Zone = $resource('zone/:zoneId', {zoneId: '@_id'}),
        Admin = $resource('admin/:adminId', {adminId: '@_id'}),
        Event = $resource('event/:eventId', {eventId: '@_id'}),
        Setting = $resource('setting/:settingId', {settingId: '@_id'}),
        Permissions = $resource('permissions/:id', {id: '@_id'}),
        backups = $.getJSON('setting/backups'),
        eventsData = []
    ;
    return {
        Setting: Setting,
        Backups: backups,
        dataEvents: eventsData,
        User: User,
        Device: Device,
        RFID: RFID,
        Event: Event,
        Zone: Zone,
        Admin: Admin,
        Permissions: Permissions
    };
});
