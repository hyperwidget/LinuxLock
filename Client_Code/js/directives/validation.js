var PHONE_REGEXP = /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/ ;
var PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_-]{8,}$/;

adminConsoleApp.directive('validatePhone', function() {
    return {
        restrict: 'A',
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

adminConsoleApp.directive('validateName', function() {
    return {
        restrict: 'A',
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

adminConsoleApp.directive('validateCard', function() {
    return {
        restrict: 'A',
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

//Validates that the password matches the regex (>8 characters with at least one upper case, one lower case, one number and a-z, A-Z or @_-)
adminConsoleApp.directive('validatePassword', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (PASSWORD_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('password', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('password', false);
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

//Used to verify that the re-entered password is the same as the first
adminConsoleApp.directive('passwordCheck', function(){
    return{
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl){
            scope.$watch(attrs.ngModel, function(){
               ctrl.$parsers.unshift(function(value){
                if(value === scope[attrs.passwordCheck]) {
                    ctrl.$setValidity('passwordCheck', true);
                    return value;
                } else {
                    ctrl.$setValidity('passwordCheck', false);
                    return undefined;
                }
               });
            });
        }
    }
});

var INTEGER_REGEXP = /^\d*$/;

adminConsoleApp.directive('integer', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (INTEGER_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('integer', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
});
