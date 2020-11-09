<?php

namespace Drupal\xlsx\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;

/**
 * Import XLSX JSON form controller.
 *
 * @ingroup xlsx
 */
class JsonFileForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['xlsx.json_file'];
  }

  /**
   * {@inheritdoc}.
   */
  public function getFormId() {
    return 'xlsx_json_import_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $xlsx = NULL) {
    $form['geodata_file'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Geo Data file'),
      '#upload_location' => 'public://xlsx/json',
      '#upload_validators' => [
        'file_validate_extensions' => ['txt', 'json'],
      ],
      '#default_value' => ($file_id = \Drupal::state()->get('xlsx_json_file_id')) ? [$file_id] : [],
      '#description' => $this->t('Upload JSON file with countes, cities and zip codes.'),
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Upload'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $json_file = $form_state->getValue('geodata_file');
    if (!empty($json_file[0])) {
      $file = File::load($json_file[0]);
      $file->setPermanent();
      $file->save();
      \Drupal::state()->set('xlsx_json_file_id', $file->id());
      if ($data = file_get_contents($file->getFileUri())) {
        $items = json_decode($data);
        $db = \Drupal::database();
        $db->delete('xlsx_json_data')->execute();
        foreach ($items as $item) {
          $db->insert('xlsx_json_data')
            ->fields([
              'city' => $item->city,
              'county' => $item->county,
              'zip' => $item->zip,
            ])
            ->execute();
        }
        \Drupal::messenger()->addStatus($this->t('Successfully uploaded and processed.'));
      }
    }
  }

}
