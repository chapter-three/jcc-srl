<?php

namespace Drupal\cc;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
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
class UserInputStorage extends SqlContentEntityStorage implements UserInputStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(UserInputInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {cc_user_input_revision} WHERE id=:id ORDER BY vid',
      [':id' => $entity->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {cc_user_input_field_revision} WHERE uid = :uid ORDER BY vid',
      [':uid' => $account->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(UserInputInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {cc_user_input_field_revision} WHERE id = :id AND default_langcode = 1', [':id' => $entity->id()])
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('cc_user_input_revision')
      ->fields(['langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED])
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
