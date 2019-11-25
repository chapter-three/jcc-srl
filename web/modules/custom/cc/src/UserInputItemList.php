<?php

namespace Drupal\cc;

use Drupal\Core\Field\FieldItemList;

/**
 * List class for user input item lists.
 */
class UserInputItemList extends FieldItemList {

  /**
   * Generates the next id.
   */
  protected function nextId() {
    return array_reduce($this->list, function ($carry, $item) {
      /** @var \Drupal\Core\Field\FieldItemInterface $item */
      $item_id = $item->get('id')->getValue();
      return $carry > $item_id ? $carry : $item_id + 1;
    }, 1);
  }

  /**
   * {@inheritDoc}
   */
  protected function createItem($offset = 0, $value = NULL) {
    if ($value !== NULL && !$value['id']) {
      $value['id'] = $this->nextId();
    }
    return parent::createItem($offset, $value);
  }

}
