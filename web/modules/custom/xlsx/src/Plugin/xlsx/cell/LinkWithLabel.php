<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "link_with_label",
 *   name = @Translation("Link with label"),
 *   description = @Translation("Link with label"),
 *   field_types = {
 *     "link",
 *   }
 * )
 */
class LinkWithLabel extends AsIs {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    $array = [];
    if ($entity->hasField($field_name)) {
      if (!empty($value)) {
        $e = explode('|', $value);
        return [
          'title' => $e[0],
          'uri' => $e[1],
        ];
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function export($entity, $field_name, $value) {
    if ($entity->hasField($field_name)) {
      if ($url = $entity->get($field_name)->uri) {
        $title = $entity->get($field_name)->title;
        return $title . '|' . $url;
      }
    }
  }

}
