(function (Drupal) {
  'use strict';

  Drupal.behaviors.locateSectionClickTrack = {
    attach: function (context) {

      /**
       * Convert a string to slug.
       *
       * @param  string text
       *   The string to convert.
       *
       * @return string
       *   The converted string.
       */
      function slugify(text) {
        return text
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/\//g, ' ')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-');
      }

      /**
       * Find the selected option and add the event to the dataLayer.
       */
      function addEventToDataLayer(event) {
        const form = this.closest('form');
        const slug = form ? slugify(form.getAttribute('action')) : null;
        const input = form.querySelectorAll('input#input-type-text, input#edit-s')[0].value;

        // Push selected option to dataLayer for Google Analytics/Tag Manager.
        window.dataLayer.push({
          event: 'gtm.click',
          'gtm.value': input,
          'gtm.elementId': slug
        });
      }

      // Attach tracker to locate-section button.
      const searchButtons = document.querySelectorAll('.jcc-locate-section button, #views-exposed-form-find-courts-self-help-page .form-submit');
      for (const button of searchButtons) {
        const tracked = button.classList.contains('js-locate-track');
        if (!tracked) {
          button.classList.add('js-locate-track');
          button.addEventListener('click', addEventToDataLayer);
        }
      }
    }
  }
})(Drupal);
