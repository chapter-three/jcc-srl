(function($) {
  'use strict';

  Drupal.behaviors.global = {
    attach: function (context) {
      $('a[href$=".pdf"]').attr('target', '_blank');
    }
  };

})(jQuery, Drupal);
