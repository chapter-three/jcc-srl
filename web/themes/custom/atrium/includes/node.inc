<?php

/**
 * @file
 * Theme and preprocess functions for nodes.
 */

/**
 * Implements hook_preprocess_node().
 */
function atrium_preprocess_node(&$variables) {
  $node = $variables['node'];

  // Allow 'node' region to be printed in certain node templates.
  // Note: When printing this region in templates, you must ensure they don't
  // also print within the corresponding page template.
  $allowed_types = ['srl_onramp'];
  if (in_array($node->bundle(), $allowed_types)) {
    atrium_add_regions_to_node(['header_node'], $variables);
  }
}
