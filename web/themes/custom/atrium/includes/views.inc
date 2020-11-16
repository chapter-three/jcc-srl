<?php

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function atrium_theme_suggestions_views_view_alter(array &$suggestions, array $variables) {
  // Add a suggestion based on the view name and the current display.
  $view = $variables['view'];
  $name = $view->id();
  $display = $view->current_display;
  $suggestions[] = 'views_view__' . $name;
  $suggestions[] = 'views_view__' . $name . '__' . $display;
}

/**
 * Implements hook_preprocess_HOOK().
 */
function atrium_preprocess_views_view(&$variables) {
  if ($variables['id'] == 'find_courts') {
    // See srl_court_finder module.
    $variables['alert_enabled'] = \Drupal::state()->get('court_finder__alert_enabled');
    $variables['alert_title'] = \Drupal::state()->get('court_finder__alert_title');
    $variables['alert_text'] = \Drupal::state()->get('court_finder__alert_text');
    $variables['alert_link_text'] = \Drupal::state()->get('court_finder__alert_link_text');
  }
}
