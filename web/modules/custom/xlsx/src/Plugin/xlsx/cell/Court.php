<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "court",
 *   name = @Translation("Court Reference"),
 *   description = @Translation("Reference to Court entity."),
 *   field_types = {
 *     "entity_reference",
 *   }
 * )
 */
class Court extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      $courts = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
        'title' => trim($value),
        'type' => 'court'
      ]);
      if ($court = reset($courts)) {
        return $court->id();
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function export($entity, $field_name, $value) {
    if ($entity->hasField($field_name)) {
      if ($ref = $entity->get($field_name)->first()->get('entity')->getTarget()) {
        return $ref->getValue()->label();
      }
    }
  }

}
