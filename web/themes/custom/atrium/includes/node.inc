<?php

/**
 * @file
 * Theme functions for the node template.
 */

use Drupal\Component\Utility\Html;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\Core\Url;
use Drupal\menu_link_content\Plugin\Menu\MenuLinkContent;

/**
 * Implements hook_preprocess_HOOK().
 */
function atrium_preprocess_node(&$variables) {
  $node = $variables['node'];
  switch ($node->getType()) {
    case "srl_howto_instruction":
    case "basic":
    case "srl_onramp":
      $variables['previous_label'] = t('Previous Page');
      if (!$node->get('field_case_type_override')->isEmpty()) {
        $case_type_override = $node->get('field_case_type_override');
        $variables['case_index']['url'] = Url::fromUri($case_type_override[0]->get('uri')->getValue());
        $variables['case_index']['label'] = t('Index: All Pages');
      } else {
        $terms = $node->get('field_case_types')->referencedEntities();
        if(count($terms) == 1){
          if (!$terms[0]->get('field_url')->isEmpty()) {
            $term_custom_uri = \Drupal::service('entity.repository')->getTranslationFromContext($terms[0])->get('field_url')->getValue();
            $variables['case_index']['url'] = Url::fromUri($term_custom_uri[0]['uri']);
            if ($term_custom_uri[0]['title'] != '') {
              $variables['case_index']['label'] = t('Index: All Pages');
            } else {
              // Translation through taxonomy management.
              $lang_code = \Drupal::languageManager()->getCurrentLanguage()->getId();
              $term_translated = Drupal::service('entity.repository')->getTranslationFromContext($terms[0], $lang_code);
              $term_name = $term_translated->getName();
              $variables['case_index']['label'] = t('Index: All Pages');
            }
          } else {
            break;
          }

        }
      }

  }
}
