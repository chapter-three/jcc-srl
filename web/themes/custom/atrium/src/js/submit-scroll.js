(function($, Drupal) {
  "use strict";

  Drupal.behaviors.submitscroll = {
    attach: function(context) {
      const submit = $(".jcc-choice-section input[type=submit]");

      if (sessionStorage.windowOffset > 1) {
        var $newPosition = 0;

        if (
          sessionStorage.submitPosition - window.innerHeight >
          sessionStorage.windowOffset - 200
        ) {
          $newPosition = parseInt(sessionStorage.windowOffset) + 200;
          console.log("1");
        } else {
          $newPosition = sessionStorage.windowOffset;
          console.log("2");
        }

        $("html, body").animate(
          {
            scrollTop: $newPosition
          },
          200
        );

        sessionStorage.windowOffset = 0;
      }

      submit.click(function(e) {
        sessionStorage.windowOffset = window.pageYOffset;
        sessionStorage.submitPosition = submit.offset().top;
        $("form.cc-user-input").submit();
      });
    }
  };
})(jQuery, Drupal);
