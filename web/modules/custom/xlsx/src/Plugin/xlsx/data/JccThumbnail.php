<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * JccThumbnail entities.
 *
 * @XlsxData(
 *   id = "jcc_thumbnail",
 *   name = @Translation("JCC Thumbnail"),
 *   entity_type = "jcc_thumbnail",
 *   module = "xlsx"
 * )
 */
class JccThumbnail extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
