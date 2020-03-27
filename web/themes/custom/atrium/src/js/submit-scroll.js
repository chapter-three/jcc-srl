(function($, Drupal) {
  "use strict";

  Drupal.behaviors.submitscroll = {
    attach: function(context) {
      // Define button.
      const $submitButton = $(".jcc-choice-section input[type=submit]");

      // Send status to sessionStorage, then submit form.
      $submitButton.click(function() {
        sessionStorage.wayfinder_submitted = true;
      });

      // Check sessionStorage for value.
      if (sessionStorage.wayfinder_submitted != undefined) {
        var $newPosition = $submitButton.offset().top - 100;

        // Scroll based so Submit button is near the top of the page.
        $("html, body").animate({ scrollTop: $newPosition }, 300);

        // Remove/reset session variable.
        sessionStorage.removeItem("wayfinder_submitted");
      }
    }
  };
})(jQuery, Drupal);
