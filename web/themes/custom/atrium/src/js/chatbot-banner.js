(function($, Drupal) {
  "use strict";

  Drupal.behaviors.chatbotBanner = {
    attach: function (context) {
      const cookieId = 'jcc-banner--chatbot';
      $(document).ready(function() {
        let delay = 300;
        if (window.matchMedia('(min-width: 1024px)')) {
          delay = 1000;
        }
        setTimeout(chatBotBanner, delay);
      });

      function chatBotBanner() {
        if ($('.jcc-chat').length != 0 && $('.jcc-chat--nobanner-flag').length == 0) {
          $('.' + cookieId).prependTo('.jcc-text-section__container:first');
          $('.' + cookieId).fadeIn(3000);
        }
      }
    }
  };
})(jQuery, Drupal);
