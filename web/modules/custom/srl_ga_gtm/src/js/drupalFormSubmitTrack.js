/**
 * @file
 * Google Tag Manager Drupal form submission tracking.
 *
 * There's a from alter to attach this library to forms and set the gtm-submit
 * class on the submit buttons.
 *
 * @see srl_ga_gtm.module
 */

(function (Drupal) {
  'use strict';

  Drupal.behaviors.drupalFormSubmitTrack = {
    attach: function (context) {

      /**
       * Find the selected option and add the event to the dataLayer.
       */
      function addEventToDataLayer(event) {
        const form = this.closest('form');

        // Push submited form id to dataLayer for Google Analytics/Tag Manager.
        window.dataLayer.push({
          event: 'gtm.submit',
          'gtm.formId': form.id
        });
      }

      // Attach tracker to gtm-submit buttons.
      const buttons = document.querySelectorAll('.gtm-submit');
      for (const button of buttons) {
        const tracked = button.classList.contains('js-submit-track');
        if (!tracked) {
          button.classList.add('js-submit-track');
          button.addEventListener('click', addEventToDataLayer);
        }
      }
    }
  }
})(Drupal);
