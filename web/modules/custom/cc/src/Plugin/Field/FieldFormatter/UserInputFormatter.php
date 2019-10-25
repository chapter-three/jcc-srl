<?php

namespace Drupal\cc\Plugin\Field\FieldFormatter;

use Drupal;
use Drupal\cc\Form\UserInputForm;
use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\entity_reference_revisions\Plugin\Field\FieldFormatter\EntityReferenceRevisionsEntityFormatter;

/**
 * Plugin implementation of the 'cc_user_input_revisions' formatter.
 *
 * @FieldFormatter(
 *   id = "cc_user_input_revisions",
 *   label = @Translation("User Input"),
 *   field_types = {
 *     "entity_reference",
 *     "entity_reference_revisions",
 *   }
 * )
 */
class UserInputFormatter extends EntityReferenceRevisionsEntityFormatter {

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    // This formatter is only available for entity types that have a view
    // builder.
    $target_type = $field_definition
      ->getFieldStorageDefinition()
      ->getSetting('target_type');
    return $target_type == 'cc_user_input';
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    if ($items instanceof EntityReferenceFieldItemListInterface) {
      $form = new UserInputForm();
      $form->setEntities($this->getEntitiesToView($items, $langcode));
      return Drupal::formBuilder()->getForm($form);
    }
    return NULL;
  }

}
