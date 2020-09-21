<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "json_zip",
 *   name = @Translation("JSON Zip"),
 *   description = @Translation("Reference JSON file."),
 *   field_types = {
 *     "string_long",
 *   }
 * )
 */
class JsonZip extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields) {
    $array = [];
    if ($entity->hasField($field_name)) {
      if (!empty($value)) {
        return $value;
      }
      $results = \Drupal::database()->select('xlsx_json_data', 'd')
        ->fields('d')
        ->condition('d.county', $entity->label())
        ->execute();
      foreach ($results as $item) {
        if (!in_array($item->zip, $array)) {
          $array[] = $item->zip;
        }
      }
      return join(', ', $array);
    }
  }

}
