<?php

/**
 * @file
 * Theme and preprocess functions for blocks.
 */

use Drupal\block\Entity\Block;
use Drupal\taxonomy\Entity\Term;

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 *
 * @see block_theme_suggestions_block()
 */
function atrium_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  if (!empty($variables['elements']['#id'])) {
    $block = Block::load($variables['elements']['#id']);
    // Recreate the same suggestions as Drupal core, including the region.
    $suggestions = [];
    if (isset($block)){
      $suggestions[] = 'block__' . $variables['elements']['#configuration']['provider'] . '__' . $block->getRegion();
    }
    $parts = explode(':', $variables['elements']['#plugin_id']);
    $suggestion = 'block';
    if (isset($block)) {
      while ($part = array_shift($parts)) {
        $suggestions[] = $suggestion .= '__' . strtr($part, '-', '_') . '__' . $block->getRegion();
      }
      if (!empty($variables['elements']['#id'])) {
        $suggestions[] = 'block__' . $variables['elements']['#id'] . '__' . $block->getRegion();
      }
    }
  }
  return $suggestions;
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 *
 * @see block_theme_suggestions_block()
 */
function atrium_preprocess_region__drawer(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  // Banner visibility for appropriate content types.
  $blacklist = ['overview', 'timeline', 'srl_onramp'];
  if ($node && $node->field_case_types[0] && !in_array($node->getType(), $blacklist)) {
    $lang_code = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $case_type = Term::load($node->field_case_types[0]->target_id);
    $case_type_translated = \Drupal::service('entity.repository')->getTranslationFromContext($case_type, $lang_code);
    if ($lang_code != 'en' && $case_type_translated) {
      $case_type = $case_type_translated;
    }
    $variables['case_type'] = $case_type->name->value;
    $variables['language_code'] = $lang_code;
  }
}
