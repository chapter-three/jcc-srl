<?php

namespace Drupal\cc\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\RevisionLogInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;

/**
 * Provides an interface for defining User input entities.
 *
 * @ingroup cc
 */
interface UserInputInterface extends ContentEntityInterface, RevisionLogInterface, EntityChangedInterface, EntityPublishedInterface {

  const SELECTION_TYPE_SELECT = 1;
  const SELECTION_TYPE_RADIO = 2;
  const SELECTION_TYPE_CHECKBOX = 3;

  /**
   * Gets the User input name.
   *
   * @return string
   *   Name of the User input.
   */
  public function getName();

  /**
   * Sets the User input name.
   *
   * @param string $name
   *   The User input name.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setName($name);

  /**
   * Gets the User Input selection type.
   *
   * @return int
   *   One of self::SELECTION_TYPE_* constants.
   */
  public function getSelectionType();

  /**
   * Sets the User Input selection type.
   *
   * @param int $type
   *   One of self::SELECTION_TYPE_* constants.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setSelectionType($type);

  /**
   * True if required option is set.
   *
   * @return bool
   *   Input is required.
   */
  public function isRequired();

  /**
   * Sedt the required flag.
   *
   * @param bool $required
   *   Value.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setRequired($required);

  /**
   * Gets the User Input items.
   *
   * @return array
   *   Array of input item descriptions.
   */
  public function getInputItems();

  /**
   * Get input items as FAPI #options array.
   *
   * @return array
   *   FAPI #options value..
   */
  public function getInputItemsOptions();

  /**
   * Sets the User Input items.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setInputItems(array $input_items);

  /**
   * Gets the User input creation timestamp.
   *
   * @return int
   *   Creation timestamp of the User input.
   */
  public function getCreatedTime();

  /**
   * Sets the User input creation timestamp.
   *
   * @param int $timestamp
   *   The User input creation timestamp.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Gets the User input revision creation timestamp.
   *
   * @return int
   *   The UNIX timestamp of when this revision was created.
   */
  public function getRevisionCreationTime();

  /**
   * Sets the User input revision creation timestamp.
   *
   * @param int $timestamp
   *   The UNIX timestamp of when this revision was created.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setRevisionCreationTime($timestamp);

  /**
   * Gets the User input revision author.
   *
   * @return \Drupal\user\UserInterface
   *   The user entity for the revision author.
   */
  public function getRevisionUser();

  /**
   * Sets the User input revision author.
   *
   * @param int $uid
   *   The user ID of the revision author.
   *
   * @return \Drupal\cc\Entity\UserInputInterface
   *   The called User input entity.
   */
  public function setRevisionUserId($uid);

}
