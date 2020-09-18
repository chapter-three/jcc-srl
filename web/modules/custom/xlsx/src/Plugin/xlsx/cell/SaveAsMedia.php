<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Download remote File and save as a Media.
 *
 * @XlsxCell(
 *   id = "save_as_media",
 *   name = @Translation("Save As Media"),
 *   description = @Translation("Download remote file, save it as media entity and attach to an entity."),
 *   field_types = {
 *     "file",
 *     "image",
 *   }
 * )
 */
class SaveAsMedia extends XlsxCellBase {

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
    return $value;
  }

}
