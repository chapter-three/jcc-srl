<?php

namespace Drupal\xlsx\Form\Mapping;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Purge Data form controller.
 *
 * @ingroup xlsx
 */
class DeleteForm extends ConfirmFormBase {

  protected $xlsx;

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $xlsx = NULL) {
    $this->xlsx = $xlsx;
    $form['purge'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Delete imported data for %name', ['%name' => $xlsx->label()]),
      '#default_value' => TRUE,
    ];
    $form = parent::buildForm($form, $form_state);
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    if (!empty($form_state->getValue('purge'))) {
      $batch = [
        'title' => $this->t('Purging %name data', ['%name' => $this->xlsx->label()]),
        'finished' => '\Drupal\xlsx\XlsxBatchOps::completePurgeCallback',
        'operations' => [],
      ];
      if ($entities = $this->loadEntitiesByMapping($this->xlsx->id())) {
        foreach ($entities as $entity) {
          $batch['operations'][] = ['\Drupal\xlsx\XlsxBatchOps::purge', [$entity]];
        }
      }
      batch_set($batch);
    }
    $message = t('%name mapping deleted.', ['%name' => $this->xlsx->label()]);
    $this->xlsx->delete();
    $this->messenger()->addStatus($message);
    $this->getLogger('xlsx')->notice($message);
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() : string {
    return 'xlsx_delete_mapping_form';
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    return new Url('xlsx.mapping');
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    return t('Are you sure you would like to delete %name mapping?', ['%name' => $this->xlsx->label()]);
  }

  /**
   * Load entity by entity type and mapping ID.
   */
  protected function loadEntitiesByMapping($mapping_id) {
    $result = \Drupal::entityQuery('xlsx_data')->condition('mapping_id', $mapping_id)->execute();
    if ($ids = array_values($result)) {
      return \Drupal::entityTypeManager()->getStorage('xlsx_data')->loadMultiple($ids);
    }
  }

}
