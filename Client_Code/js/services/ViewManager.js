'use strict';

adminConsoleApp.factory('viewManager', function () {
    var settings = {
            '': {
                addEditTemplate: ''
            },
            users: {
                addEditTemplate: 'templates/userAddEdit'
            },
            devices: {
                addEditTemplate: 'templates/devicesAddEdit'
            }
        },
        showPopup = function () {
            $('#popup').show();
        },
        hidePopup = function () {
            $('#popup').hide();
        };
    return {
        showPopup: showPopup,
        hidePopup: hidePopup,
        settings: settings
    };
});