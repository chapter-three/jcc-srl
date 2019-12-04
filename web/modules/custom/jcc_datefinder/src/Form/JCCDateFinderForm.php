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
      '#attributes' => [
        'data-datefinder-value' => 'days_to_add'
      ]
    ];
    $form['input_date'] = [
      '#type' => 'date',
      '#weight' => '1',
      '#title' => $paragraph->field_label_date_input->value,
      '#placeholder' => t('Select Date')
    ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Nothing to do.
  }
}
