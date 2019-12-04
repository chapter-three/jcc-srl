<?php

namespace Drupal\jcc_datefinder\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * Class JCCDateFinderForm.
 */
class JCCDateFinderForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'jcc_datefinder_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, Paragraph $paragraph = NULL) {

    $form['days_to_add'] = [
      '#type' => 'hidden',
      '#weight' => '0',
      '#value' => $paragraph->field_days->value,
    ];

    $form['input_date'] = [
      '#type' => 'textfield',
      '#weight' => '1',
      '#title' => $paragraph->field_label_date_input->value,
      '#attributes' => [
        'placeholder' => t('Select date'),
        'aria-label' => $paragraph->field_label_date_input->value,
      ]
    ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Nothing to do.
  }
}
