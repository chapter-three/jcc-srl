<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "form_category",
 *   name = @Translation("Form category"),
 *   description = @Translation("Form category"),
 *   field_types = {
 *     "entity_reference",
 *   }
 * )
 */
class FormCategory extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      if (!empty($value)) {
        $terms = explode(',', $value);
        foreach ($terms as $term_name) {
          $t_name = trim($term_name);
          $result = \Drupal::entityTypeManager()->getStorage('jcc_category')
            ->loadByProperties(['name' => $t_name]);
          if ($jcc_category = reset($result)) {
            return [
              'target_id' => $jcc_category->getTermId(),
            ];
          }
        }
      }
    }
  }

}
