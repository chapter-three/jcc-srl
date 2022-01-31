<?php
/**
 * Implements template_preprocess_paragraph().
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An array of elements to display in view mode.
 *   - paragraph: The paragraph object.
 *   - view_mode: View mode; e.g., 'full', 'teaser'...
 */

use Drupal\Core\Url;

function atrium_preprocess_paragraph(&$variables) {
  /** @var \Drupal\paragraphs\Entity\Paragraph $paragraph */
  $paragraph = $variables['paragraph'];

  if($paragraph->getType() == 'switchboard'){
    $parent = $paragraph->getParentEntity();
    if($parent->bundle() == 'overview'){

      $terms = $parent->get('field_case_types')->referencedEntities();
      $case_forms_uri = $parent->get('field_case_type_forms_page');
      $case_forms_url = $case_forms_uri->uri ? Url::fromUri($case_forms_uri->uri)->toString() : null;
      if(count($terms) == 1){
        if (!$terms[0]->get('field_url')->isEmpty()) {
          $variables['switchboard_footer']['label'] = t('Already know what you are looking for?');

          $term_custom_uri = $terms[0]->get('field_url')->getValue();
          $variables['switchboard_footer']['buttons'][0]['url'] = Url::fromUri($term_custom_uri[0]['uri']);
          $variables['switchboard_footer']['buttons'][1]['url'] = $case_forms_url;
          $variables['switchboard_footer']['buttons'][0]['icon']['name'] = 'file';
          $variables['switchboard_footer']['buttons'][1]['icon']['name'] = 'list';
          if ($term_custom_uri[0]['title'] != '') {
            $variables['switchboard_footer']['buttons'][0]['title'] = t('See ') . t($term_custom_uri[0]['title']) . t(' Forms');
            $variables['switchboard_footer']['buttons'][1]['title'] = t('Index: All ') . t($term_custom_uri[0]['title']) . t(' Pages');
          } else {
            // Translation through taxonomy management.
            $lang_code = \Drupal::languageManager()->getCurrentLanguage()->getId();
            $term_translated = Drupal::service('entity.repository')->getTranslationFromContext($terms[0], $lang_code);
            $term_name = $term_translated->getName();
            $variables['switchboard_footer']['buttons'][0]['title'] = t('See ') . $term_name . t(' Forms');
            $variables['switchboard_footer']['buttons'][1]['title'] = t('Index: All ') . $term_name . t(' Pages');
          }
        }
      }
    }
  }
}
