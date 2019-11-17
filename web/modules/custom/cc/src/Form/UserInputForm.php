<?php

namespace Drupal\cc\Form;

use Drupal;
use Drupal\cc\Entity\UserInputInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * User input form.
 */
class UserInputForm extends FormBase {

  /**
   * The user input entity.
   *
   * @var \Drupal\Core\Entity\EntityInterface[]
   */
  protected $entities;

  /**
   * Gets user input entities.
   *
   * @return \Drupal\Core\Entity\EntityInterface[]
   *   The user input entities.
   */
  public function getEntities() {
    return $this->entities;
  }

  /**
   * Sets UserInput entities.
   *
   * @param \Drupal\Core\Entity\EntityInterface[] $entities
   *   The user input entities.
   *
   * @return $this
   */
  public function setEntities(array $entities) {
    $this->entities = $entities;
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cc_user_input';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // If there are no user input entities, no need for a form.
    if (empty($this->entities)) {
      return [];
    }

    $form['#method'] = 'get';
    $form['#cache'] = ['max-age' => 0];
    $form['#token'] = FALSE;

    // Each user input element.
    foreach ($this->entities as $delta => $entity) {

      $base_element = [
        '#title' => $entity->label(),
        '#weight' => 10 + $delta,
        '#default_value' => Drupal::request()->query->get($entity->id()) ?: [],
        '#required' => $entity->isRequired(),
      ];
      $options = $entity->getInputItemsOptions();

      switch ($entity->getSelectionType()) {

        case UserInputInterface::SELECTION_TYPE_RADIO:
          if (count($options)) {
            $form[$entity->id()] = [
              '#type' => 'radios',
              '#options' => $options,
            ] + $base_element;
          }
          else {
            $form[$entity->id()] = [
              '#type' => 'radio',
            ] + $base_element;
          }
          break;

        case UserInputInterface::SELECTION_TYPE_CHECKBOX:
          if (count($options)) {
            $form[$entity->id()] = [
              '#type' => 'checkboxes',
              '#options' => $options,
            ] + $base_element;
          }
          else {
            $form[$entity->id()] = [
              '#type' => 'checkbox',
            ] + $base_element;
          }
          break;

        case UserInputInterface::SELECTION_TYPE_SELECT:
          $form[$entity->id()] = [
            '#type' => 'select',
            '#options' => $options,
          ] + $base_element;
          break;

      }
    }

    $form['submit'] = [
      '#name' => 'submit',
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
      '#weight' => 999,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Form is processed when entity is prepared for rendering.
    // @see cc_entity_view_alter()
  }

}
