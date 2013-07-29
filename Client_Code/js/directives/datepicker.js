adminConsoleApp.directive('datePicker', function() {
  return {
    restrict: 'C',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      if(ngModel) {
        var val = ""
        if("value" in element)
          val = element.value
        element.datepicker({
          dateFormat:$.datepicker.RFC_2822,
          onSelect:function (date) {
            ngModel.$setViewValue(new Date(date))
          }
        })
        element.value = val
      }
    }
  }
});
