<?php

namespace Drupal\xlsx\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining FormThumbnail entities.
 *
 * @ingroup xlsx
 */
interface JccThumbnailInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Gets the FormThumbnail name.
   *
   * @return string
   *   Name of the FormThumbnail.
   */
  public function getName();

  /**
   * Sets the FormThumbnail name.
   *
   * @param string $name
   *   The FormThumbnail name.
   *
   * @return \Drupal\xlsx\Entity\JccThumbnailInterface
   *   The called FormThumbnail entity.
   */
  public function setName($name);

  /**
   * Gets the FormThumbnail filename.
   *
   * @return string
   *   Name of the FormThumbnail.
   */
  public function getFilename();

  /**
   * Sets the FormThumbnail filename.
   *
   * @param string $name
   *   The FormThumbnail filename.
   *
   * @return \Drupal\xlsx\Entity\JccThumbnailInterface
   *   The called FormThumbnail entity.
   */
  public function setFilename($name);

  /**
   * Gets the FormThumbnail creation timestamp.
   *
   * @return int
   *   Creation timestamp of the FormThumbnail.
   */
  public function getCreatedTime();

  /**
   * Sets the FormThumbnail creation timestamp.
   *
   * @param int $timestamp
   *   The FormThumbnail creation timestamp.
   *
   * @return \Drupal\xlsx\Entity\JccThumbnailInterface
   *   The called FormThumbnail entity.
   */
  public function setCreatedTime($timestamp);

}
