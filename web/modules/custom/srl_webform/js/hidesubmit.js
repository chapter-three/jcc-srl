(function($, Drupal) {
  "use strict";
  
  Drupal.behaviors.hidesubmit = {
    attach: function(context, drupalSettings) {

      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-"+$formId+"-form";
      const $submitButton = $($formClass+" #edit-wizard-next, "+$formClass+" #edit-submit", context);
      const $inputs = $($formClass+" .form-radios input")

      $inputs.on('change', function() {
        $submitButton.trigger('click');
      });
      
      $submitButton.hide();
      
    }
  };
})(jQuery, Drupal);
