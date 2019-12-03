(function ($) {
  
  'use strict';
  
  Drupal.behaviors.datefinder = {
    attach: function (context) {
  
      const inputEl = $('input[type="date"]');
      const resultContainer = $('.jcc-datefinder__adjacent-dates');
      const resultTextEl = $('.jcc-datefinder__date');
      const defaultDays = 30;
  
      inputEl.on('change keyup', function() {
        const date = new Date(Date.parse(inputEl.val()) + (defaultDays * 60 * 60 * 24) * 1000);

        if (date != 'Invalid Date'){
          resultContainer.removeAttr('hidden');
          resultTextEl.html(date);
        }
      })
    }
  }
  
})(jQuery, Drupal);
