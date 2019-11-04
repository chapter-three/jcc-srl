<?php

namespace Drupal\cc;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the User input entity.
 *
 * @see \Drupal\cc\Entity\UserInput.
 */
class UserInputAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\cc\Entity\UserInputInterface $entity */

    switch ($operation) {

      case 'view':

        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished user input entities');
        }

        return AccessResult::allowedIfHasPermission($account, 'view published user input entities');

      case 'update':

        return AccessResult::allowedIfHasPermission($account, 'edit user input entities');

      case 'delete':

        return AccessResult::allowedIfHasPermission($account, 'delete user input entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add user input entities');
  }

}
