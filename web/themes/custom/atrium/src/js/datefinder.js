(function ($) {
  
  'use strict';
  
  Drupal.behaviors.datefinder = {
    attach: function (context) {
  
      const inputEl = $('[data-drupal-selector="edit-input-date"]');
      const resultContainer = $('.jcc-datefinder__adjacent-dates');
      const resultTextEl = $('.jcc-datefinder__date');
      const daysToAdd = $('[data-drupal-selector="edit-days-to-add"]').val();
      const prettyFormat = "F j, Y";
      
      // Use flatpickr js to create datepicker.
      flatpickr(inputEl, {
        altInput: true,
        altFormat: prettyFormat,
        dateFormat: "Y-m-d",
      });
  
      // Calculate and display result date.
      inputEl.on('change keyup', function() {

        // 60 sec * 60 min * 24 hours = 86400
        const resultDateMilisecs = new Date(Date.parse(inputEl.val()) + (daysToAdd * 86400) * 1000);

        if (resultDateMilisecs != 'Invalid Date') {
          resultContainer.removeAttr('hidden');
          const resultDateString = flatpickr.formatDate(resultDateMilisecs , prettyFormat)
          resultTextEl.html(resultDateString);
        }
      })
    }
  }
  
})(jQuery, Drupal);
