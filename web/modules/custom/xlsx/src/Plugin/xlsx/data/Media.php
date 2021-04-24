<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * Media entities.
 *
 * @XlsxData(
 *   id = "media",
 *   name = @Translation("Default"),
 *   entity_type = "media",
 *   module = "media"
 * )
 */
class Media extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties(['type' => $bundle]);
  }

}
