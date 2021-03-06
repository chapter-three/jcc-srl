(function($, Drupal) {
  "use strict";

  Drupal.behaviors.hideSubmit = {
    attach: function(context, drupalSettings) {

      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-" + $formId.replace(/_/g, "-") + "-form";
      const $submitButton = $(
        $formClass + " .webform-button--next, " +
        $formClass + " .webform-button--submit",
        context
      );
      const $inputs = $(
        $formClass + " select, " +
        $formClass + " .form-radios input"
      );

      $inputs.on('change click select', function() {
        $submitButton.trigger('click');
      });

      if ($inputs.length) {
        $submitButton.hide();
      }
    }
  };
})(jQuery, Drupal);
