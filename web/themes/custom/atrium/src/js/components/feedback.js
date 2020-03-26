(function($) {
  "use strict";

  Drupal.behaviors.feedback = {
    attach: function() {

      // Elements.
      const $window = $(window);
      const $feedback_trigger = $('[data-feedback^="trigger"]');
      const $feedback_container = $('[data-feedback="container"]');
      const $feedback_dialog = $('[data-feedback="dialog"]');
      const $feedback_confirmation = $(
        '[data-feedback="container"] .webform-confirmation'
      );

      // Functions.
      const feedbackOpen = () => {
        $feedback_dialog.attr("open", "open");
        $feedback_container.attr("open", "open");
      };

      const feedbackDismiss = () => {
        $feedback_container.hide();
      };

      const feedbackDismissPath = () => {
        return sessionStorage.feedback_dismissed_page ==
          window.location.pathname;
      };

      const feedbackConfirmed = () => {
        return $feedback_confirmation.length > 0;
      };
      
      const isScrolledToBottom = () => {
        const scrollAmount = $window.scrollTop();
        const windowHeight = $window.height();
        const halfHeight = windowHeight / 2;
        const scrollLocation = (scrollAmount + windowHeight) - halfHeight ;
        const halfPageHeight = $('.jcc-footer').offset().top / 2 ;
        
        return scrollLocation >= halfPageHeight;

      };
  
      const isSmallScreen = () => {
        const mql = window.matchMedia('(max-width: 40em)');
        return mql.matches ? true : false;
    
      };
      
      // Scroll.
      $window.on('scroll', function(){
        console.log(isSmallScreen())
        console.log(isScrolledToBottom())
  
        if(
          (isScrolledToBottom() && isSmallScreen() )
          || isSmallScreen() == false
        ) {
          $feedback_container.attr('visible', 'visible');
        } else{
          $feedback_container.removeAttr('visible');
        }
      });
  
      // Allow User to dismiss completely if confirmation is visisble.
      if (feedbackConfirmed() == true) {
        if (feedbackDismissPath() == true) {
          feedbackDismiss();
        } else {
          $feedback_dialog.removeAttr("style");
          feedbackOpen();
        }
      }
  
      // Click.
      $feedback_trigger.on("click", function(e) {
        e.preventDefault;
        if ($feedback_dialog.attr("open")) {
          if (
            feedbackConfirmed() &&
            $(this).attr("data-feedback") == "trigger-close"
          ) {
            sessionStorage.feedback_dismissed_page = window.location.pathname;
            feedbackDismiss();
          } else {
            $feedback_container.css("transition", "all .2s");
            $feedback_dialog.removeAttr("open");
            $feedback_container.removeAttr("open");
          }
        } else {
          feedbackOpen();
        }
      });
    }
  };
})(jQuery, Drupal);
