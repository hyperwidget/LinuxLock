adminConsoleApp.directive('datePicker', function() {
  return {
    restrict: 'C',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      if(ngModel) {
        element.datepicker({
          dateFormat:$.datepicker.RFC_2822,
          onSelect:function (date) {
            ngModel.$setViewValue(new Date(date))
          }
        })
      }
    }
  }
});
