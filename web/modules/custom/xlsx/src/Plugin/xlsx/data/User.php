<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * User entities.
 *
 * @XlsxData(
 *   id = "user",
 *   name = @Translation("Default"),
 *   entity_type = "user",
 *   module = "user"
 * )
 */
class User extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
