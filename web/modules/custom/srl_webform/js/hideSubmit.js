(function($, Drupal) {
  "use strict";
  
  Drupal.behaviors.hideSubmit = {
    attach: function(context, drupalSettings) {

      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-"+$formId.replace(/_/g,"-")+"-form";
      const $submitButton = $(
        $formClass+" #edit-wizard-next, "+
        $formClass+" #edit-submit",
        context
      );
      const $inputs = $(
        $formClass+" .form-checkbox, "+
        $formClass+" select, "+
        $formClass+" .form-radios input"
      );
      
      $inputs.on('change click select', function() {
        $submitButton.trigger('click');
      });
      
      $submitButton.hide();
    }
  };
})(jQuery, Drupal);
