(function (Drupal) {
  'use strict';

  Drupal.behaviors.heroCardJumpNavClickTrack = {
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
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-');
      }

      /**
       * Find the selected option and add the event to the dataLayer.
       */
      function addEventToDataLayer(event) {
        const parent = this.parentNode;
        const cardBody = this.closest('.jcc-card__body');
        const cardTitle = cardBody.querySelector('.jcc-card__title');
        const slug = 'gtm.go--' + slugify(cardTitle.innerText);
        let category = {};
        let select = {};


        if (parent.classList.contains('jcc-jump-menu')) {
          select = parent.querySelector('select');
        }

        if (parent.classList.contains('jcc-cascading-jump-menu')) {
          category = parent.querySelector('select.jcc-cascading-jump-menu__parent');
          select = parent.querySelector('select.jcc-cascading-jump-menu__child');
        }
        const selectedCategory = category.options && category.options[category.selectedIndex] ? category.options[category.selectedIndex].text : null;
        const selectedElement = select.options && select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : null;

        // Push selected option to dataLayer for Google Analytics/Tag Manager.
        window.dataLayer.push({
          event: slug,
          selectedCategory: selectedCategory,
          selectedElement: selectedElement
        });
      }

      // Attach tracker to jump-menu buttons.
      const jumpButtons = document.querySelectorAll('.jcc-jump-menu button, .jcc-cascading-jump-menu button');
      for (const button of jumpButtons) {
        const tracked = button.classList.contains('js-submit-track');
        if (!tracked) {
          button.classList.add('js-submit-track');
          button.addEventListener('click', addEventToDataLayer);
        }
      }
    }
  }
})(Drupal);
