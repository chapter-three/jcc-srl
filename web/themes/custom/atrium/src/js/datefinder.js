(function ($) {
  
  'use strict';
  
  Drupal.behaviors.datefinder = {
    attach: function (context) {
  
      const inputEl = $('input[type="date"]');
      const resultContainer = $('.jcc-datefinder__adjacent-dates');
      const resultTextEl = $('.jcc-datefinder__date');
      const defaultDays = 30;
      const prettyFormat = "F j, Y";
      
      flatpickr(inputEl, {
        altInput: true,
        altFormat: prettyFormat,
        dateFormat: "Y-m-d",
      });
  
      inputEl.on('change keyup', function() {
        const resultDateAsMilisecs = new Date(Date.parse(inputEl.val()) + (defaultDays * 60 * 60 * 24) * 1000);

        if (resultDateAsMilisecs != 'Invalid Date') {
          resultContainer.removeAttr('hidden');
          const resultDateString = flatpickr.formatDate(resultDateAsMilisecs , prettyFormat)
          resultTextEl.html(resultDateString);
        }
      })
    }
  }
  
})(jQuery, Drupal);
