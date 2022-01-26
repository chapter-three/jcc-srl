(function($) {
  'use strict';

  Drupal.behaviors.global = {
    attach: function (context) {
      $('a[href$=".pdf"]').addClass('download').attr('target', '_blank');
    }
  };

})(jQuery, Drupal);
