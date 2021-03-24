<?php

namespace Drupal\xlsx\Plugin\xlsx\data;

use Drupal\xlsx\Plugin\XlsxDataBase;

/**
 * JccPrefix entities.
 *
 * @XlsxData(
 *   id = "jcc_prefix",
 *   name = @Translation("JCC Prefix"),
 *   entity_type = "jcc_prefix",
 *   module = "xlsx"
 * )
 */
class JccPrefix extends XlsxDataBase {

  /**
   * {@inheritdoc}
   */
  public function getEntities($xlsx, $entity_type, $bundle) {
    return $this->entityTypeManager->getStorage($entity_type)->loadByProperties([]);
  }

}
