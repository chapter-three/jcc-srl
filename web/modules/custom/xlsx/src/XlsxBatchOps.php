<?php

namespace Drupal\xlsx;

/**
 * Xlsx Batch API.
 *
 * @ingroup xlsx
 */
class XlsxBatchOps {

  /**
   * Purge previously imported data.
   */
  public static function purge($entity, &$context) {
    if ($entity) {
      $context['results'][] = $entity->id();
      $imported_entity = \Drupal::entityTypeManager()
        ->getStorage($entity->get('entity_type_id')->value, $entity->get('bundle')->value)
        ->load($entity->get('entity_id')->value);
      if ($imported_entity) {
        $context['message'] = t('Deleting %label ...', ['%label' => $imported_entity->label()]);
        $imported_entity->delete();
      }
      else {
        $context['message'] = t('Deleting %id ...', ['%id' => $entity->id()]);
      }
      $entity->delete();
    }
  }

  /**
   * Import mapped data.
   */
  public static function import($xlsx, $destination, $worksheet_index, $sheet_name, $data, &$context) {
    $mapping = $xlsx->getMapping();
    $entity_fields = [];
    $data_array = array_values($data);
    $raw_data_row = [];
    $entity_mapping = $mapping['entity_mapping'];
    $entity = \Drupal::entityTypeManager()->getStorage($destination['type'])->create(['type' => $destination['bundle']]);
    foreach ($mapping['field_mapping'][$worksheet_index] as $drupal_field => $info) {
      $value = !empty($data_array[0][$info['column']]) ? $data_array[0][$info['column']] : NULL;
      if ($value) {
        $raw_data_row[] = $value;
        $entity->set($drupal_field, $value);
      }
    }
    // We need this loop to apply XLSX Cell plugin tranformation.
    // Second loop will have access to the complete entity with all the mapping fields populated.
    foreach ($mapping['field_mapping'][$worksheet_index] as $drupal_field => $info) {
      $value = !empty($data_array[0][$info['column']]) ? $data_array[0][$info['column']] : NULL;
      // Load cell transformer plugin.
      $xlsx_cell = !empty($data_array[0][$info['cell_plugin']]) ? $data_array[0][$info['cell_plugin']] : 'as_is';
      if ($value) {
        if ($plugin = \Drupal::service('plugin.manager.xlsx_cell')->createInstance($xlsx_cell)) {
          $entity->set($drupal_field, $plugin->import($entity, $drupal_field, $value));
        }
      }
    }

    if (!empty($raw_data_row)) {
      $entity->save();
      $xlsx_data = \Drupal::entityTypeManager()->getStorage('xlsx_data')->create(['type' => 'xlsx_data']);
      $xlsx_data->set('mapping_id', $xlsx->id());
      $xlsx_data->set('worksheet_index', $worksheet_index);
      $xlsx_data->set('entity_id', $entity->id());
      $xlsx_data->set('entity_type_id', $destination['type']);
      $xlsx_data->set('bundle', $destination['bundle']);
      $xlsx_data->set('hash', md5(serialize($raw_data_row)));
      $xlsx_data->save();
      $context['message'] = t('Importing %name ...', ['%name' => $entity->label()]);
      $context['results'][] = $entity->id();
    }
    else {
      $context['message'] = t('Skipping empty row ...');
    }
  }

  /**
   * BatchAPI complete callback for data purge.
   */
  public static function completePurgeCallback($success, $results, $operations) {
    self::complete('1 record deleted.', '@count records deleted.', $success, $results);
  }

  /**
   * BatchAPI complete callback for data import.
   */
  public static function completeImportCallback($success, $results, $operations) {
    self::complete('1 row imported.', '@count rows imported.', $success, $results);
  }

  /**
   * Helper method for complete callbacks.
   */
  protected static function complete($singular, $plural, $success, $results) {
    if ($success) {
      $message = \Drupal::translation()->formatPlural(count($results), $singular, $plural);
      \Drupal::logger('xlsx')->notice($message);
    }
    else {
      $message = t('Finished with an error.');
    }
    \Drupal::messenger()->addMessage($message, 'status', TRUE);
  }

}
