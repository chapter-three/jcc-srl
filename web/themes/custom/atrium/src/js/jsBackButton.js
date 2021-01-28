/**
 * @file
 * Add back button functionality for .js-back-button.
 */

(function($, Drupal) {
  "use strict";

  Drupal.behaviors.jsBackButton = {
    attach: function(context) {
      // Define button.
      const button = $(".js-back-button");

      button.click(function (e) {
        e.preventDefault();
        history.go(-1);
      });
    }
  };
})(jQuery, Drupal);
