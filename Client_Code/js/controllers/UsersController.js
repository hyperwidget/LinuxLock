'use strict';

adminConsoleApp.controller('UsersController',
    function UsersController ($scope, dataManager, viewManager, $http) {
        var setAddZoneDisabled = function (newValue) {
            if(newValue !== null){
                var found = false;
                if ($scope.currentUser != null) {
                    angular.forEach($scope.currentUser.zones, function(v, k) {
                        if (v.zone_id == newValue._id) found = true;
                    });
                }
                $scope.isAddZoneDisabled = found;
            }
        };

        var setAddCardDisabled = function (newValue) {
            if(newValue !== null){
                var found = false;
                if ($scope.currentUser != null) {
                    angular.forEach($scope.currentUser.cards, function(v, k) {
                        if (v.rfid_id == newValue._id) found = true;
                    });
                }
                $scope.isAddCardDisabled = found;
            }
        };

        $scope.isAddButtonDisabled = false;
        $scope.isEditButtonDisabled = true;
        $scope.isDeleteButtonDisabled = true;

        $scope.users = dataManager.User.query();
        $scope.zones = dataManager.Zone.query();
        $scope.cards = [];
        $scope.currentUser = null;
        $scope.currentIndex = -1;

        $scope.isAddCardDisabled = true;
        $scope.isRemoveCardDisabled = true;
        $scope.selectedCardToAdd = null;
        $scope.selectedCardToRemove = null;

        $scope.isAddZoneDisabled = true;
        $scope.isRemoveZoneDisabled = true;
        $scope.selectedZoneToAdd = null;
        $scope.selectedZoneToRemove = null;

        $scope.addUser = function () {
            if ($scope.zones.length) $scope.selectedZoneToAdd = $scope.zones[0];
            $scope.currentUser = new dataManager.User();
            if($scope.currentUser.cards !== undefined) {
                $scope.selectedCardToRemove = $scope.currentUser.cards[0];
            }
            if($scope.currentUser.zones !== undefined) {
                $scope.selectedZoneToRemove = $scope.currentUser.zones[0];
            }
            $scope.cards = dataManager.RFID.query({status: 'inactive'}, function () {
                if ($scope.cards.length) $scope.selectedCardToAdd = $scope.cards[0];
            });
            viewManager.showPopup('users', $scope);
        };
        $scope.editUser = function () {
            if($scope.currentIndex !== -1){
                if ($scope.zones.length) $scope.selectedZoneToAdd = $scope.zones[0];
                $scope.currentUser =  $scope.users[$scope.currentIndex];
                if($scope.currentUser.cards !== undefined) {
                    $scope.selectedCardToRemove = $scope.currentUser.cards[0];
                }
                if($scope.currentUser.zones !== undefined) {
                    $scope.selectedZoneToRemove = $scope.currentUser.zones[0];
                }
                $scope.cards = dataManager.RFID.query({status: 'inactive'}, function () {
                    if ($scope.cards.length) $scope.selectedCardToAdd = $scope.cards[0];
                });
                viewManager.showPopup('users', $scope);
            }
        };
        $scope.saveData = function () {
            $scope.currentUser.$save();
            $scope.users = dataManager.User.query();
            $scope.selectedCardToAdd = null;
            $scope.selectedCardToRemove = null;
            $scope.selectedZoneToAdd = null;
            $scope.selectedZoneToRemove = null;
            $scope.hidePopup();
        };
        $scope.cancelSave = function () {
            $scope.selectedCardToAdd = null;
            $scope.selectedCardToRemove = null;
            $scope.selectedZoneToAdd = null;
            $scope.selectedZoneToRemove = null;
        };
        $scope.deleteUser = function() {
            $scope.confirm = confirm('Are you sure you want to delete this user?');
            if($scope.confirm === true){
                $scope.currentUser = $scope.users[$scope.currentIndex];
                $scope.currentUser.$delete();
                $scope.users = dataManager.User.query();                
            }
        };
        $scope.changeCurrentUser = function (event, index) {
            $('.selected').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            $scope.currentIndex = index;
        };
        $scope.searchByFirstName = function(){
            if($scope.first !== undefined && $scope.first !== ''){
                $scope.users = dataManager.User.query({first: $scope.first});
            } else if($scope.first == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByLastName = function(){
            if($scope.last !== undefined && $scope.last !== ''){
                $scope.users = dataManager.User.query({last: $scope.last});
            } else if($scope.last == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByEmail = function(){
            if($scope.email !== undefined && $scope.email !== ''){
                $scope.users = dataManager.User.query({email: $scope.email});
            } else if($scope.email == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByPhone = function(){
            if($scope.phone !== undefined && $scope.phone !== ''){
                $scope.users = dataManager.User.query({phone: $scope.phone});
            } else if($scope.phone == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.searchByZone = function(){
            if($scope.zone !== undefined && $scope.zone !== ''){
                $scope.users = dataManager.User.query({zone: $scope.zone._id});
            } else if($scope.zone == '') {
                $scope.users = dataManager.User.query();
            }
        };
        $scope.addZone = function () {
            if($scope.currentUser.zones !== undefined){
                $scope.currentUser.zones.push({ zone_id: $scope.selectedZoneToAdd._id, name: $scope.selectedZoneToAdd.name });
            } else {
                $scope.currentUser.zones = [];
                $scope.currentUser.zones.push({ zone_id: $scope.selectedZoneToAdd._id, name: $scope.selectedZoneToAdd.name });
            }
            if ($scope.currentUser.zones && $scope.currentUser.zones.length == 1) $scope.selectedZoneToRemove = $scope.currentUser.zones[0];
            setAddZoneDisabled($scope.selectedZoneToAdd);
        };
        $scope.removeZone = function () {
            var idx = -1;
            var i = 0;
            var zones = $scope.currentUser.zones;
            while (idx == -1 && i < zones.length) {
                if (zones[i].zone_id == $scope.selectedZoneToRemove.zone_id) {
                    idx = i;
                }
                i++;
            }
            if (idx > -1) zones.splice(idx, 1);
            $scope.selectedZoneToRemove = null;
            setAddZoneDisabled($scope.selectedZoneToAdd);
        };
        $scope.$watch('selectedZoneToAdd', function (newValue, oldValue) {
            setAddZoneDisabled(newValue);
        });
        $scope.$watch('selectedZoneToRemove', function (newValue, oldValue) {
            $scope.isRemoveZoneDisabled = newValue == null;
        });
        $scope.addCard = function () {
            if($scope.currentUser.cards !== undefined){
                $scope.currentUser.cards.push({ rfid_id: $scope.selectedCardToAdd._id, rfidNo: $scope.selectedCardToAdd.rfidNo });
            } else {
                $scope.currentUser.cards = [];
                $scope.currentUser.cards.push({ rfid_id: $scope.selectedCardToAdd._id, rfidNo: $scope.selectedCardToAdd.rfidNo });
            }
            if ($scope.currentUser.cards && $scope.currentUser.cards.length == 1) $scope.selectedCardToRemove = $scope.currentUser.cards[0];
            setAddCardDisabled($scope.selectedCardToAdd);
        };
        $scope.removeCard = function () {
            var idx = -1;
            var i = 0;
            var cards = $scope.currentUser.cards;
            while (idx == -1 && i < cards.length) {
                if (cards[i].rfid_id == $scope.selectedCardToRemove.rfid_id) {
                    idx = i;
                }
                i++;
            }
            if (idx > -1) cards.splice(idx, 1);
            $scope.selectedCardToRemove = null;
            setAddCardDisabled($scope.selectedCardToAdd);
        };
        $scope.$watch('selectedCardToAdd', function (newValue, oldValue) {
            setAddCardDisabled(newValue);
        });
        $scope.$watch('selectedCardToRemove', function (newValue, oldValue) {
            $scope.isRemoveCardDisabled = newValue == null;
        });
        $scope.$watch('currentIndex', function (newValue, oldValue) {
            $scope.isEditButtonDisabled = $scope.isDeleteButtonDisabled = newValue < 0;
        });
    }
);