<?php

/**
 * @file
 * Theme functions for the node template.
 */

use Drupal\Component\Utility\Html;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\menu_link_content\Plugin\Menu\MenuLinkContent;

/**
 * Implements hook_preprocess_HOOK().
 */
function atrium_preprocess_node(&$variables) {
  $node = $variables['node'];
  switch ($node->getType()) {
    case "srl_howto_instruction":
      if (!$node->get('field_case_type_override')->isEmpty()) {
        $case_type_override = $node->get('field_case_type_override');
        $variables['case_index']['url'] = $case_type_override[0]->get('uri')->getValue();
        $variables['case_index']['label'] = t('Index: All ') . $case_type_override[0]->get('title')->getValue() . t(' Pages');
      } else {
        $terms = $node->get('field_case_types')->referencedEntities();
        if(count($terms) == 1){
          if (!$terms[0]->get('field_url')->isEmpty()) {
            $term_custom_uri = $terms[0]->get('field_url')->getValue();
            $variables['case_index']['url'] = $term_custom_uri[0]['uri'];
          } else {
            $id = $terms[0]->id();
            $aliasManager = \Drupal::service('path.alias_manager');
            $variables['case_index']['url'] = $aliasManager->getAliasByPath('/taxonomy/term/'.$id);
          }
          $variables['case_index']['label'] = t('Index: All ') . $terms[0]->label() . t(' Pages');
        }
      }
      break;
  }
}
