<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * JccCategory entities.
 *
 * @XlsxData(
 *   id = "jcc_category",
 *   name = @Translation("JCC Category"),
 *   entity_type = "jcc_category",
 *   module = "xlsx"
 * )
 */
class JccCategory extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
