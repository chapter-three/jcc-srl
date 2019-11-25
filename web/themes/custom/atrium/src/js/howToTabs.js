(function ($) {
  
  'use strict';
  
  Drupal.behaviors.howToTabs = {
    attach: function (context) {
  
      // @todo Make this generic if we end up reusing this functionality.

      // Define body.
      const body = $('.jcc-tab-section__container + .jcc-text-section');
      
      // Define paths and hashes.
      const path1 = '/debt-collection/bank-levy-bank-levied-my-account'
      const path2 = '/debt-collection/bank-levy'
      const hash = '#show-body';
      
      // Define buttons.
      const button1 = $('[role="tablist"] a[href="' + path1 + '"]');
      const button2 = $('[role="tablist"] a[href="' + path2 + hash + '"]');
  
      // Page load behavior.
      if ( window.location.pathname === path1) {
        button1.attr('aria-selected', "true")
      }
      else if (
        (window.location.pathname === path2) &&
        (window.location.hash === '')
      ) {
        body.hide();
        body.attr('aria-hidden', 'true');
      }
      else if(
        (window.location.pathname === path2) &&
        (window.location.hash === hash)
      ) {
        button2.attr('aria-selected', "true")
      }
      
      // Button click behavior.
      button2.click( function() {
        button1.removeAttr('aria-selected');
        button2.attr('aria-selected', "true");
        body.show();
        body.removeAttr('aria-hidden', 'true');
      });
  
      button1.click( function() {
        button1.attr('aria-selected', "true");
        button2.removeAttr('aria-selected');
      })
    }
  }
  
})(jQuery, Drupal);
