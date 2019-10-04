/**
 * Calculate future dates based on a date entered on the srl_date_calculator
 * form.
 */
(function ($, Drupal) {
  Drupal.behaviors.calculateDate = {
    attach: function (context, settings) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];
      $('#srl-date-calculator-form').submit( function (e) {
        e.preventDefault();
        var date = new Date($('#srl-date-calculator-form #edit-date').val());
        var time = date.getTime();
        $(this).parents('.paragraph--type--srl-date-calculator')
          .find('.paragraph--type--calculation-date').each(
          function () {
            calculationDays = parseInt($(this).find('.field--name-field-days').html(), 10);
            calculationDays = time + (calculationDays * 60 * 60 * 24) * 1000;
            futureDate = new Date(calculationDays);
            day = futureDate.getDate();
            month = futureDate.getMonth();
            year = futureDate.getFullYear();
            $(this).find('.calculated-date').html(monthNames[month] + ' ' + day + ', ' + year);
            $(this).find('.field--name-field-label').show();
          }
        );
      });
    }
  };
})(jQuery, Drupal);
