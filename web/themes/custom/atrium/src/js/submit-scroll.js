(function($, Drupal) {
  "use strict";

  Drupal.behaviors.submitscroll = {
    attach: function(context) {
      // Define button.
      const $submitButton = $(".jcc-choice-section input[type=submit]");

      // Send offset values to sessionStorage, then submit form.
      $submitButton.click(function(e) {
        sessionStorage.windowOffset = window.pageYOffset;
        sessionStorage.submitPosition = $submitButton.offset().top;
        $("form.cc-user-input").submit();
      });

      // Check sessionStorage for value.
      if (sessionStorage.windowOffset > 1) {
        var $newPosition = 0;

        if (
          // Submit button is near the bottom of the window.
          sessionStorage.submitPosition - window.innerHeight >
          sessionStorage.windowOffset - 200
        ) {
          $newPosition = parseInt(sessionStorage.windowOffset) + 200;
        } else {
          // Submit button is not near the bottom of the window.
          $newPosition = sessionStorage.windowOffset;
        }

        // Scroll based on offset values before submit.
        $("html, body").animate({ scrollTop: $newPosition }, 200);
      }
    }
  };
})(jQuery, Drupal);
