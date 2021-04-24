<?php

namespace Drupal\xlsx\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining JccPrefix entities.
 *
 * @ingroup xlsx
 */
interface JccPrefixInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Gets the JccPrefix name.
   *
   * @return string
   *   Name of the JccPrefix.
   */
  public function getName();

  /**
   * Sets the JccPrefix name.
   *
   * @param string $name
   *   The JccPrefix name.
   *
   * @return \Drupal\xlsx\Entity\JccPrefixInterface
   *   The called JccPrefix entity.
   */
  public function setName($name);

  /**
   * Gets the JccPrefix label.
   *
   * @return string
   *   Name of the JccPrefix.
   */
  public function getPrefixLabel();

  /**
   * Sets the JccPrefix label.
   *
   * @param string $label
   *   The JccPrefix label.
   *
   * @return \Drupal\xlsx\Entity\JccPrefixInterface
   *   The called JccPrefix entity.
   */
  public function setPrefixLabel($label);

  /**
   * Gets the JccPrefix creation timestamp.
   *
   * @return int
   *   Creation timestamp of the JccPrefix.
   */
  public function getCreatedTime();

  /**
   * Sets the JccPrefix creation timestamp.
   *
   * @param int $timestamp
   *   The JccPrefix creation timestamp.
   *
   * @return \Drupal\xlsx\Entity\JccPrefixInterface
   *   The called JccPrefix entity.
   */
  public function setCreatedTime($timestamp);

}
