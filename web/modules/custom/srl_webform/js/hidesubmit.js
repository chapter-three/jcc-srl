(function($, Drupal) {
  "use strict";
  
  Drupal.behaviors.hidesubmit = {
    attach: function(context, drupalSettings) {

      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-"+$formId+"-form";
      const $form = $($formClass);
      const $submitButton = $($formClass+" #edit-wizard-next, "+$formClass+" #edit-submit");
      const $inputs = $($formClass+" .form-radios input")
  
      $inputs.on('change', function() {
        $form.submit()
      });
      
      $submitButton.hide();
      
    }
  };
})(jQuery, Drupal);
