<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "json_county",
 *   name = @Translation("JSON County"),
 *   description = @Translation("Reference JSON file."),
 *   field_types = {
 *     "string_long",
 *   }
 * )
 */
class JsonCounty extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      if (!empty($value)) {
        return $value;
      }
    }
  }

}
