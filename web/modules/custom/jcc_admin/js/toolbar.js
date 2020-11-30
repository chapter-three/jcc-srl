/**
 * @file
 * General tweaks for the administrative user interface. This file is loaded on
 * all pages where the administrative theme is in use.
 */

(function($, Drupal, document, window) {

  /**
   * Prevents the Administrative Toolbar from popping out as a sidebar when
   * screen width is reduced.
   */
  Drupal.behaviors.jccAdminToolbarResizeTweak = {
    attach: function (context) {
      window.matchMedia('(min-width: 975px)').addListener(function(event) {
        event.matches ? $('#toolbar-item-administration', context).click() : $('.toolbar-item.is-active', context).click();
      });
    }
  }

}(jQuery, Drupal, document, window));
