<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * Taxonomy entities.
 *
 * @XlsxData(
 *   id = "taxonomy",
 *   name = @Translation("Taxonomy"),
 *   entity_type = "taxonomy_term",
 *   module = "taxonomy"
 * )
 */
class Taxonomy extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties(['type' => $bundle]);
  }

}
