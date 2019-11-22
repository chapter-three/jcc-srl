<?php

namespace Drupal\cc\Plugin\Field\FieldFormatter;

use Drupal;
use Drupal\cc\Form\UserInputForm;
use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormState;
use Drupal\entity_reference_revisions\Plugin\Field\FieldFormatter\EntityReferenceRevisionsEntityFormatter;
use Exception;

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
   *
   * @throws \Drupal\Core\Form\FormAjaxException
   * @throws \Drupal\Core\Form\EnforcedResponseException
   * @throws \Exception
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    if ($items instanceof EntityReferenceFieldItemListInterface) {
      $entities = $this->getEntitiesToView($items, $langcode);

      $form_state = new FormState();
      $form_state->setMethod('get');
      // $form_state->setAlwaysProcess(TRUE);
      $form_state->setRebuild();

      $form_object = new UserInputForm();
      $form_object->setEntities($entities);
      $form = Drupal::formBuilder()->buildForm($form_object, $form_state);
      unset($form['form_build_id']);
      if (cc_user_input_form_state()) {
        throw new Exception('Multiple user input forms not supported.');
      }
      cc_user_input_form_state($form_state);
      return $form;
    }
    return NULL;
  }

}
