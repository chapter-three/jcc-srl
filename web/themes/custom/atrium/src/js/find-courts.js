(function ($, Drupal) {
  'use strict';

  /**
   * Clear the id/nid form element (since it's hidden) so the search
   * only uses what the user typed.
   */
  Drupal.behaviors.findCourts = {
    attach: function (context) {
      $('.view').each(function(i, view) {
        const $view = $(view);
        if ($view.hasClass('view-find-courts')) {
          $view.find('.form-item-s input').on('keydown', function() {
            $view.find('.form-item-id input').val('');
          });
          $view.find('input.form-submit').on('mousedown', function(event) {
            $view.find('.form-item-id input').val('');
          });
        }
      });
    }
  };


  /**
   * When there are multiple `court` results from a search, the user
   * will need to pick one of the results (called $court_links below).
   * Update the search's exposed form with the link's data. This is for
   * ajax enabled views only.
   *
   * See views-view--find-courts--self-help-block.html.twig for more
   */
  Drupal.behaviors.selfHelpMiniBlock = {
    attach: function (context) {
      $.each(Drupal.views.instances, function(i, view) {
        if (view.settings.view_name == 'find_courts' && view.settings.view_display_id == 'self_help_block') {
          var $view = $(view.element_settings.selector);
          var $court_links = $view.find('.court-links a');

          $court_links.on('click', function(event) {
            event.preventDefault();

            var nid = $(this).attr('data-nid');
            $view.find('input[name=id]').val(nid);
            $view.find('input[type=submit]').click();
          });
        }
      });
    }
  };

})(jQuery, Drupal);
