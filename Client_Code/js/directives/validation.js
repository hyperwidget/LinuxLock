var PHONE_REGEXP = /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/ ;

adminConsoleApp.directive('phone', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (PHONE_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('phone', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('phone', false);
                    return undefined;
                }
            });
        }
    };
});

var NAME_REGEXP = /^[a-zA-Z'\-,\.][a-zA-Z'\-,\. ]+$/;

adminConsoleApp.directive('name', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (NAME_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('name', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('name', false);
                    return undefined;
                }
            });
        }
    };
});

var CARD_REGEXP = /^[A-Z0-9]{10}$/;

adminConsoleApp.directive('card', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (CARD_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('card', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }
            });
        }
    };
});

adminConsoleApp.directive('status', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (viewValue == "active" || viewValue == "inactive") {
                    ctrl.$setValidity('status', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('status', false);
                    return undefined;
                }
            });
        }
    };
});
