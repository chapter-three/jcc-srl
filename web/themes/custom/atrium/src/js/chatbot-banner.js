(function($, Drupal) {
  "use strict";

  Drupal.behaviors.chatbotBanner = {
    attach: function (context) {

      $(document).ready(function() {
        setTimeout(chatBotBanner, 500);
      });

      function chatBotBanner() {
        if ($('.jcc-chat').length != 0) {
          $('.jcc-banner--chatbot').prependTo('.jcc-text-section__column-left');
          $('.jcc-banner--chatbot').fadeIn(2000);
        }
      }
    }
  };
})(jQuery, Drupal);
