(function($) {
  "use strict";
  
  Drupal.behaviors.feedback = {
    attach: function(context) {
      const feedback_trigger = $('[data-feedback="trigger"]');
      const feedback_container = $('[data-feedback="container"]');
      const feedback_dialog = $('[data-feedback="dialog"]');
  
      feedback_trigger.on('click', function(e) {
        e.preventDefault();
        if (feedback_dialog.attr('open')) {
          feedback_dialog.removeAttr('open');
          feedback_container.removeAttr('open');
        } else {
          feedback_dialog.attr('open', 'open');
          feedback_container.attr('open', 'open');
        }
      });
      
    }
  };
})(jQuery, Drupal);
