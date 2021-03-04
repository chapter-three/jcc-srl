<?php

namespace Drupal\xlsx\Plugin\xlsx\cell;

use Drupal\xlsx\Plugin\XlsxCellBase;

/**
 * Default XLSX cell plugin.
 *
 * @XlsxCell(
 *   id = "jcc_thumbnail",
 *   name = @Translation("JCC Thumbnail"),
 *   description = @Translation("JCC Thumbnail"),
 *   field_types = {
 *     "image",
 *   }
 * )
 */
class Thumbnail extends XlsxCellBase {

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    if ($entity->hasField($field_name)) {
      $result = \Drupal::entityTypeManager()->getStorage('jcc_thumbnail')
        ->loadByProperties(['name' => $value]);
      if ($entity = reset($result)) {
        $filename = $entity->getFilename();
        $thumbnails = \Drupal::entityTypeManager()->getStorage('jcc_form_thumbnail')
          ->loadByProperties(['name' => $filename]);
        if ($thumbnail = reset($thumbnails)) {
          return [
            'target_id' => $thumbnail->getFileId(),
          ];
        }
      }
    }
  }

}
