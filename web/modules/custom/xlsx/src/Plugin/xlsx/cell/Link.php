<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "link",
 *   name = @Translation("Link"),
 *   description = @Translation("Process link fields"),
 *   field_types = {
 *     "link",
 *   }
 * )
 */
class Link extends AsIs {

  /**
   * {@inheritdoc}
   */
  public function export($entity, $field_name, $value) {
    if ($entity->hasField($field_name)) {
      if ($url = $entity->get($field_name)->uri) {
        return $url;
      }
    }
  }

}
