(function($, Drupal) {
  "use strict";
  
  Drupal.behaviors.validatePhoneOrEmail = {
    attach: function(context) {
      
      const $error = '<div class="form-item--error-message usa-error-message"><strong></strong></div>';
  
      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-"+$formId.replace(/_/g,"-")+"-form";
  
      function validateEmail($input) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($input)) {
          return (true)
        }
        return (false)
      }
  
      function validatePhone($input) {
        if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test($input)) {
          return (true)
        }
        return (false)
      }
  
      function validatePhoneOrEmal($input) {
        validateEmail($input)
        validatePhone($input)
        
        console.log(validateEmail($input))
        console.log(validatePhone($input))
      }

      $($formClass).on('submit', function() {
        const $input = $(".js-form-type-emailorphone input").val()
        validatePhoneOrEmal($input)
      });

    }
  };
})(jQuery, Drupal);

