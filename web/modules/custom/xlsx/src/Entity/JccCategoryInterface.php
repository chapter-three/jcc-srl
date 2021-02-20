<?php

namespace Drupal\xlsx\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining JccCategory entities.
 *
 * @ingroup xlsx
 */
interface JccCategoryInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Gets the JccCategory name.
   *
   * @return string
   *   Name of the JccCategory.
   */
  public function getName();

  /**
   * Sets the JccCategory name.
   *
   * @param string $name
   *   The JccCategory name.
   *
   * @return \Drupal\xlsx\Entity\JccCategoryInterface
   *   The called JccCategory entity.
   */
  public function setName($name);

  /**
   * Gets the JccCategory creation timestamp.
   *
   * @return int
   *   Creation timestamp of the JccCategory.
   */
  public function getCreatedTime();

  /**
   * Sets the JccCategory creation timestamp.
   *
   * @param int $timestamp
   *   The JccCategory creation timestamp.
   *
   * @return \Drupal\xlsx\Entity\JccCategoryInterface
   *   The called JccCategory entity.
   */
  public function setCreatedTime($timestamp);

}
