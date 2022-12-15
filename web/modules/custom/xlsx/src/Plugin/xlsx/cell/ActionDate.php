<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "action_date",
 *   name = @Translation("Action Date"),
 *   description = @Translation("Process action date values"),
 *   field_types = {
 *     "datetime",
 *   }
 * )
 */
class ActionDate extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      //$drupalDate = date('Y-m-d', time());
      if (!empty($value)) {
        $dates = explode(',', $value);
        $processed = [];
        foreach ($dates as $date) {
          if (!in_array($date, $processed)) {
            $drupalDate = date('Y-m-d', strtotime($date));
            $processed[] = $drupalDate;
          }
        }

        return $processed;
      }
    }
  }

}
