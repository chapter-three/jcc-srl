<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "revision_date",
 *   name = @Translation("Revision Date"),
 *   description = @Translation("Process revision date fields"),
 *   field_types = {
 *     "datetime",
 *   }
 * )
 */
class RevisionDate extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      $drupalDate = date('Y-m-d', time());
      if (!empty($value)) {
        $drupalDate = date('Y-m-d', strtotime($value));
      }

      return $drupalDate;
    }
  }

}
