<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "form_prefix",
 *   name = @Translation("Form prefix"),
 *   description = @Translation("Form prefix"),
 *   field_types = {
 *     "entity_reference",
 *   }
 * )
 */
class FormPrefix extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      $prefix = preg_replace('/^([^-]+)-.+$/is', "$1", $value);
      $result = \Drupal::entityTypeManager()->getStorage('jcc_prefix')
        ->loadByProperties(['name' => $prefix]);
      if ($jcc_prefix = reset($result)) {
        return [
          'target_id' => $jcc_prefix->getTermId(),
        ];
      }
    }
  }

}
