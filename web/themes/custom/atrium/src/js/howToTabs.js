(function ($) {
  
  'use strict';
  
  Drupal.behaviors.howToTabs = {
    attach: function (context) {
      
      const body = $('.jcc-tab-section__container + .jcc-text-section');
      const button = $('[role="tablist"] a');
  
      body.hide();
      body.attr('aria-hidden', 'true');
  
      if (window.location.hash == '#show-body') {
        body.show();
        body.removeAttr('aria-hidden');
      }
      
      button.click( function() {
        body.show()
        body.removeAttr('aria-hidden', 'true');
      })
      
    }
  }
  
})(jQuery, Drupal);
