<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * File entities.
 *
 * @XlsxData(
 *   id = "file",
 *   name = @Translation("Default"),
 *   entity_type = "file",
 *   module = "file"
 * )
 */
class File extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
