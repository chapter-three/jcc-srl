<?php

/**
 * @file
 * Theme functions for the page template.
 */

use Drupal\Component\Utility\Html;
use Drupal\Core\Menu\MenuTreeParameters;

/**
 * Implements hook_preprocess_HOOK().
 */
function atrium_preprocess_page(&$variables) {
  $current_path = \Drupal::service('path.current')->getPath();
  $path_segments = explode('/', $current_path);
  $eid = isset($path_segments[2]) ? $path_segments[2] : NULL;

  if ($path_segments[1] == 'media' || $path_segments[1] == 'node' || $path_segments[1] == 'webform') {
    $entity_type = $path_segments[1];

    /** @var \Drupal\media\Entity\Media $entity */
    /** @var \Drupal\node\Entity\Node $entity */
    $entity = \Drupal::entityTypeManager()->getStorage($entity_type)->load($eid);

    if (isset($entity)) {
      $entity_bundle = $entity->bundle();
      $variables['entity_bundle'] = $entity_bundle;
    }
  }

  $variables['menu_main'] = _atrium_get_menutree('main');
}

/**
 * Gets a menu tree.
 *
 * @param string $menu_name
 *   The name of the menu to load. Currently supports depth of 2 levels.
 *
 * @return array
 *   The menu tree.
 */
function _atrium_get_menutree($menu_name) {
  // Get the tree.
  $menu_tree_service = \Drupal::service('menu.link_tree');
  $tree = $menu_tree_service->load($menu_name, new MenuTreeParameters());
  // Apply some manipulators (checking the access, sorting).
  $manipulators = [
    ['callable' => 'menu.default_tree_manipulators:checkNodeAccess'],
    ['callable' => 'menu.default_tree_manipulators:checkAccess'],
    ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
  ];
  $tree = $menu_tree_service->transform($tree, $manipulators);

  $menu_items = [];
  foreach ($tree as $item) {
    if ($item->link->isEnabled()) {
      // Top level link. If it has children, this link becomes a toggle button.
      $parent_title = $item->link->getTitle();
      $parent_url_obj = $item->link->getUrlObject();
      $parent_url = $parent_url_obj->toString();

      $children = [];
      if ($item->hasChildren) {
        foreach ($item->subtree as $child) {
          if ($child->link->isEnabled()) {
            $child_title = $child->link->getTitle();
            $child_url_obj = $child->link->getUrlObject();
            $child_url = $child_url_obj->toString();
            $children[] = [
              'text' => $child_title,
              'href' => $child_url,
            ];
          }
        }
      }

      $menu_items[] = [
        'text' => $parent_title,
        'href' => $parent_url,
        'id' => Html::getId($parent_title),
        'links' => $children,
      ];
    }
  }

  return $menu_items;
}
