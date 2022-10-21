(function($, Drupal) {
  "use strict";

  Drupal.behaviors.jcc_forms = {
    attach: function(context, drupalSettings) {

      let findButton = document.getElementById('edit-submit-jcc-forms-search-json-api');
      findButton.value = 'Search';
      let exposedFilter = document.getElementById('views-exposed-form-jcc-forms-search-json-api-page');
      exposedFilter.classList.add('show');
    }
  };
})(jQuery, Drupal);
