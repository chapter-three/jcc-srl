<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Download remote File.
 *
 * @XlsxCell(
 *   id = "save_as_file",
 *   name = @Translation("Save As File"),
 *   description = @Translation("Download remote file, save it as a File entity and attach to an entity."),
 *   field_types = {
 *     "file",
 *     "image",
 *   }
 * )
 */
class SaveAsFile extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value) {
    if ($entity->hasField($field_name)) {
      
    }
    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function export($entity, $field_name, $value) {
    if ($entity->hasField($field_name)) {
      
    }
    return $value;
  }

}
