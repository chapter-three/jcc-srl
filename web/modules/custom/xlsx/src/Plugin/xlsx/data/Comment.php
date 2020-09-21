<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * Comment entities.
 *
 * @XlsxData(
 *   id = "comment",
 *   name = @Translation("Default"),
 *   entity_type = "comment",
 *   module = "comment"
 * )
 */
class Comment extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
