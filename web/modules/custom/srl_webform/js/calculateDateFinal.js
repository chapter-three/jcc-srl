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
        const selected = new Date($(this).val());
        const formattedDate = selected.toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'});
        const calculateDate = new Date(addDaysToDate(selected, 21));
        const calculateDateFinal = calculateDate.toLocaleString('en-us',{month:'short', day: 'numeric', year:'numeric'});

        $(".selected_date").text(formattedDate);
        $(".calculate_date").text(calculateDateFinal);
        $formMessage.show();
      });

      $formClassCloseMsg.on("click",function(){
        $formMessage.hide();
      });
    }
  };
})(jQuery, Drupal);
