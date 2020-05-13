(function($, Drupal) {
  "use strict";
  
  Drupal.behaviors.validatePhoneOrEmail = {
    attach: function(context) {
      
      const $error = "<div class=\"form-item--error-message usa-error-message\"><strong>Please enter a valid email or phone number.</strong></div>";
      const $inputEl = $(".js-form-type-emailorphone input");
  
      const validateEmail = ($input) =>  {
       if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($input)) {
          return true;
        }
        return false;
      };
  
      const validatePhone = ($input) =>  {
        if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test($input)) {
          return true;
        }
        return false;
      };
  
      function validatePhoneOrEmal($input) {

        validateEmail($input)
        validatePhone($input)
  
        console.log(validateEmail($input))
        console.log(validatePhone($input))
        
        if(validateEmail($input) == false || validatePhone($input) == false) {
          // $(".js-form-type-emailorphone").insertAfter($error);
        }
      }

      $($inputEl).on('keyup', function(e) {
        const $input = $(this).val()
        validatePhoneOrEmal($input)
      });

    }
  };
})(jQuery, Drupal);

