(function($) {
  "use strict";

  Drupal.behaviors.drawer = {
    attach: function() {

      // Elements.
      const $window = $(window);
      const $feedback_trigger = $('[data-feedback^="trigger"]');
      const $feedback_container = $('[data-feedback="container"]');
      const $drawer = $('.region--drawer');
      const $feedback_dialog = $('[data-feedback="dialog"]');

      const isScrolledToBottom = ($scrollPosition, $windowHeight, $footPosition) => {
        const $windowHeightHalf = $windowHeight / 2;
        const $scrollDiff = ($scrollPosition + $windowHeight) - $windowHeightHalf ;
        const $pageHeightHalf =  $footPosition/ 2 ;

        return $scrollDiff >= $pageHeightHalf;
      };

      const pageIsShorterThanWindow = ($scrollPosition, $windowHeight, $footPosition) => {
        const $scrollDiff = $footPosition - $windowHeight;

        return $scrollDiff > $scrollPosition;
      };

      const isSmallScreen = () => {
        const mql = window.matchMedia('(max-width: 40em)');
        return mql.matches ? true : false;
      };

      // Scroll.
      $window.on('scroll', function(){

        const $scrollPosition = $window.scrollTop();
        const $windowHeight = $window.height();
        const $footPosition = $('footer').offset().top;

        if(
          (isScrolledToBottom($scrollPosition, $windowHeight, $footPosition) && isSmallScreen())
          || isSmallScreen() == false
        ) {
          $drawer.attr('visible', 'visible');
        } else {
          $drawer.removeAttr('visible');
        }

        if (pageIsShorterThanWindow($scrollPosition, $windowHeight, $footPosition)) {
          $drawer.attr('fixed', 'fixed');
        } else {
          $drawer.removeAttr('fixed');
        }
      });

      // Click.
      $feedback_trigger.on("click", function(e) {
        e.preventDefault;
        if ($feedback_dialog.attr("open")) {
          $('#jcc-chatbot').hide();
        } else {
          $('#jcc-chatbot').show();
        }
      });

      // Hide when chatbot opens.
      window.addEventListener('chat-open', function (e) {
        $feedback_trigger.hide();
        $feedback_container.hide();
      }, false);

      // Show when chatbot closes.
      window.addEventListener('chat-close', function (e) {
        $feedback_trigger.show();
        $feedback_container.show();
      }, false);
    }
  };
})(jQuery, Drupal);
