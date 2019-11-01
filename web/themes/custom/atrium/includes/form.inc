<?php

/**
 * @file
 * Theme and preprocess functions for forms.
 */

/**
 * Implements hook_preprocess_form_element().
 */
function atrium_preprocess_form_element(&$variables) {
  // Provide the element in the context of label.
  $variables['label']['#parent_element'] = $variables['element'];
}
