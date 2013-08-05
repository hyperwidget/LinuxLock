'use strict';

adminConsoleApp.factory('viewManager', function ($http, $compile) {
    var showPopup = function (view, scope) {
            $http.get('templates/' + view + 'AddEdit').success(function(tmplContent) {
                $('.windowContent').html($compile(tmplContent)(scope));
                saveFn = scope.saveData;
                cancelFn = scope.cancelSave;
            });
            $('#popup').show();
        },
        hidePopup = function () {
            if (cancelFn) cancelFn();
            $('#popup').hide();
        },
        saveFn = null,
        cancelFn = null,
        saveData = function() {
            if (saveFn) saveFn();
            hidePopup();
        },
        findByID = function (data, id) {
            for(var i = 0;i < data.length; i++) {
                if (data[i]._id == id)
                    return i;
            }
        };
    return {
        showPopup: showPopup,
        hidePopup: hidePopup,
        saveData: saveData,
        findByID: findByID
    };
});