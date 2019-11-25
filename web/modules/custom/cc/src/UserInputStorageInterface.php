<?php

namespace Drupal\cc;

use Drupal\Core\Entity\ContentEntityStorageInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\cc\Entity\UserInputInterface;

/**
 * Defines the storage handler class for User input entities.
 *
 * This extends the base storage class, adding required special handling for
 * User input entities.
 *
 * @ingroup cc
 */
interface UserInputStorageInterface extends ContentEntityStorageInterface {

  /**
   * Gets a list of User input revision IDs for a specific User input.
   *
   * @param \Drupal\cc\Entity\UserInputInterface $entity
   *   The User input entity.
   *
   * @return int[]
   *   User input revision IDs (in ascending order).
   */
  public function revisionIds(UserInputInterface $entity);

  /**
   * Gets a list of revision IDs having a given user as User input author.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user entity.
   *
   * @return int[]
   *   User input revision IDs (in ascending order).
   */
  public function userRevisionIds(AccountInterface $account);

  /**
   * Counts the number of revisions in the default language.
   *
   * @param \Drupal\cc\Entity\UserInputInterface $entity
   *   The User input entity.
   *
   * @return int
   *   The number of revisions in the default language.
   */
  public function countDefaultLanguageRevisions(UserInputInterface $entity);

  /**
   * Unsets the language for all User input with the given language.
   *
   * @param \Drupal\Core\Language\LanguageInterface $language
   *   The language object.
   */
  public function clearRevisionsLanguage(LanguageInterface $language);

}
