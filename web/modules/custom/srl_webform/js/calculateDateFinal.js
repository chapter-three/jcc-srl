/**
 * @file
 * General code for the date calculation on webform page. This file is loaded on
 * Demand Letter for security webform.
 */

(function($, Drupal) {
  "use strict";

  Drupal.behaviors.calculateDateFinal = {
    attach: function(context, drupalSettings) {

      const addDaysToDate = (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d.toISOString().split('T')[0];
      };
      const minusDaysFromToDate = (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() - n);
        return d.toISOString().split('T')[0];
      };

      const $formId = drupalSettings.srl_webform.id;
      const $formClass = ".webform-submission-" + $formId.replace(/_/g, "-") + "-form";
      const $formClassDate = $(
        $formClass + " .form-date"
      );
      const $formClassCloseMsg = $(
        $formClass + " .close-btn"
      );
      const $formMessage = $(
        ".webform-message"
      );
      $formMessage.hide();
      $formClassDate.on("change",function(){
        const todaysDate = new Date();
        const selected = new Date($(this).val());
        const utcSelectedDate = new Date(selected.getUTCFullYear(), selected.getUTCMonth(), selected.getUTCDate());
        const differenceInTime = todaysDate.getTime() - utcSelectedDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        const formattedDate = utcSelectedDate.toLocaleString('en-us',{month:'long', day: 'numeric', year:'numeric'});
        const calculateDate = new Date(addDaysToDate(utcSelectedDate, 22));
        const calculateDateFinal = calculateDate.toLocaleString('en-us',{month:'long', day: 'numeric', year:'numeric'});
        $(".selected_date").text(formattedDate);
        $(".calculate_date").text(calculateDateFinal);

        // Hide message box If selected date is more than 21 days back
        if(differenceInDays <= 22) {
          $formMessage.show();
        }else{
          $formMessage.hide();
        }

      });

      $formClassCloseMsg.on("click",function(){
        $formMessage.hide();
      });
    }
  };
})(jQuery, Drupal);
