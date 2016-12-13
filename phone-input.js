/*
http://codepen.io/vladymy/pen/oboEBo
Automatic phone number formatting in input field

Credits:
    - Wade Tandy via
    http://stackoverflow.com/questions/19094150/using-angularjs-directive-to-format-input-field-while-leaving-scope-variable-unc
    
    - kstep via
    http://stackoverflow.com/questions/12700145/how-to-format-a-telephone-number-in-angularjs
    
    - hans via
    http://codepen.io/hans/details/uDmzf/
*/

(function () {
'use strict';

var app = angular.module('phone.input', []);
 /*
app.controller('MyCtrl', function($scope) {
  $scope.currencyVal;
});
*/

var re = {
  tel: /(\d{1,3})(\d{1,3})?(\d{1,2})?(\d{1,2})?/,
  non_digit:  /[^0-9]/g
};

app.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                //~ var value = $element.val().replace(re.non_digit, '');
                $element.val($filter('tel')($element.val(), false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(re.non_digit, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});
app.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().replace(re.non_digit, '').slice(0,10);//.replace(/^\+/, '');

        //~ if (value.match(re.non_digit)) {
            //~ return tel;
       //~ }
      
      //~ var nums = re.tel.exec(value);
      var nums = value.match(re.tel);
      var fmt = "(" + nums[1];
      if (nums[2]) fmt = fmt + ") " + nums[2];
      if (nums[3]) fmt = fmt + "-"+ nums[3];
      if (nums[4]) fmt = fmt + "-"+ nums[4];
      
      return fmt;


    };
});

}());