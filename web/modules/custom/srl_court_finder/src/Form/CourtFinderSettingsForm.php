<?php

namespace Drupal\srl_court_finder\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\State\StateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Settings for Court Finder.
 */
class CourtFinderSettingsForm extends FormBase {

  /**
   * Provides the state api service.
   *
   * @var \Drupal\Core\State\StateInterface
   */
  protected $state;

  /**
   * {@inheritdoc}
   */
  public function __construct(StateInterface $state) {
    $this->state = $state;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('state'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'court_finder_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['alert'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Alert box'),
    ];
    $form['alert']['alert_enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enabled'),
      '#default_value' => $this->state->get('court_finder__alert_enabled'),
    ];
    $form['alert']['alert_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Alert title'),
      '#maxlength' => 64,
      '#size' => 64,
      '#default_value' => $this->state->get('court_finder__alert_title'),
    ];
    $form['alert']['alert_text'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Alert text'),
      '#description' => 'Add <code>%link%</code> where the link to the county court\'s website should go',
      '#default_value' => $this->state->get('court_finder__alert_text'),
    ];
    $form['alert']['alert_link_text'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Alert link text'),
      '#maxlength' => 64,
      '#size' => 64,
      '#default_value' => $this->state->get('court_finder__alert_link_text'),
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->state->set('court_finder__alert_enabled', $form_state->getValue('alert_enabled'));
    $this->state->set('court_finder__alert_title', $form_state->getValue('alert_title'));
    $this->state->set('court_finder__alert_text', $form_state->getValue('alert_text'));
    $this->state->set('court_finder__alert_link_text', $form_state->getValue('alert_link_text'));

    $this->messenger()->addMessage('Successfully saved.', $this->messenger::TYPE_STATUS);
  }

}
