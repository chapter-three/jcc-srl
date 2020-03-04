(function($) {
  "use strict";
  
  Drupal.behaviors.feedback = {
    attach: function(context) {
      const feedback_trigger = $('[data-feedback="trigger"]');
      const feedback_container = $('[data-feedback="container"]');
      const feedback_dialog = $('[data-feedback="dialog"]');
      const feedback_confirmation = $('[data-feedback="container"] .webform-confirmation')

      const feedbackOpen = () => {
        feedback_dialog.attr('open', 'open');
        feedback_container.attr('open', 'open');
      };
  
      if (feedback_confirmation.length > 0 ) {
        feedback_dialog.removeAttr('style');
        feedbackOpen();
      };
  
      feedback_trigger.on('click', function(e) {
        e.preventDefault();
        if (feedback_dialog.attr('open')) {
          feedback_container.css('transition', 'all .2s');
          feedback_dialog.removeAttr('open');
          feedback_container.removeAttr('open');
        } else {
          feedbackOpen();
        }
      });
    }
  };
})(jQuery, Drupal);
