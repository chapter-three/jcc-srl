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
  } elseif($variables['id'] == 'solr_search') {
    $vid = 'search_categories';
    $search_arg = trim($variables['view']->exposed_data['search_api_fulltext']);
    //Checking if bew argument exists as a taxonomy term name
    $term_lookup = taxonomy_term_load_multiple_by_name($search_arg, $vid);
    if (!empty($term_lookup)){
      $variables['featured_view'] = array_key_first($term_lookup);
    }
  }
}

/**
 * Implements hook_preprocess_HOOK().
 */
function atrium_preprocess_views_view__find_forms__all_by_category(&$variables) {
  if (empty($variables['rows'])) {
    return;
  }
  $forms = [];

  foreach ($variables['rows'][0]['#rows'] as $row) {
    $item = $row['#row'];
    $item_id = $item->_entity->field_number;
    array_push($forms, $item_id);

    // Assign form per category.
//    foreach ($item->_entity->field_form_category as $category) {
//      dpm($category);
      //$category_label = $category->_entity->field_form_category[0]->entity->label();
//      $form = [
//        'form_id' => $item_id,
//        'form_category' => 'test',
//      ];
//      array_push($forms, $form);
//    }
  }
  dpm($forms);

  // Group forms by category.
//  $forms_by_category = [];
//  foreach ($forms as $value) {
//    if ($value['form_category']) {
//      $category = $value['form_category'];
//      $forms_by_category[$category][] = $value;
//    }
//  }
//
//  $variables['forms_by_category'] = $forms_by_category;
  $variables['forms_by_category'] = $forms;
}
