<?php

/**
 * @file
 * Theme functions for the page template.
 */

use Drupal\Component\Utility\Html;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\menu_link_content\Plugin\Menu\MenuLinkContent;

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

  // Drupal menus.
  $variables['menu_main'] = _atrium_get_menutree('main');
  $variables['menu_hat'] = _atrium_get_menutree('hat');
  $variables['menu_footer'] = _atrium_get_menutree('footer');

  // Social links for footer.
  $social = [];
  $social['facebook'] = theme_get_setting('facebook');
  $social['flickr'] = theme_get_setting('flickr');
  $social['linkedin'] = theme_get_setting('linkedin');
  $social['twitter'] = theme_get_setting('twitter');
  $social['youtube'] = theme_get_setting('youtube');
  $variables['social'] = $social;

  // Add js-back-button functionality to all pages.
  $variables['#attached']['library'][] = 'atrium/js-back-button';

  // BEGIN Site Branding.
  //Get theme logo from appearance setting.
  $theme_logo = theme_get_setting('logo.url');

  //  Get basic site settings (e.g. site name for logo alt).
  $config = \Drupal::config('system.site');
  $site_name = $config->get('name');

  $logo['desktop'] = $theme_logo;
  $logo['mobile'] = $theme_logo;

  $variables['site_branding'] = [
    'logo' => $logo,
    'title' => $site_name,
  ];
  // END.
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

  // Get the current node's `case type` taxonomy term(s) to set the
  // active_trail on menu items.
  $node_tids = [];
  $node = \Drupal::routeMatch()->getParameter('node');
  // Skip if is_numeric as we're likely looking at a revision.
  if (!is_numeric($node) && isset($node)) {
    $terms = $node->get('field_case_types')->referencedEntities();
    foreach ($terms as $term) {
      $node_tids[] = $term->id();
    }
  }

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
            /** @var \Drupal\menu_link_content\Plugin\Menu\MenuLinkContent $link */
            $link = $child->link;

            // Set the active_trail if this menu item has the same term as the
            // current node.
            $active_trail = FALSE;
            if ($link instanceof MenuLinkContent) {
              $uuid = $link->getDerivativeId();
              $entity = \Drupal::service('entity.repository')->loadEntityByUuid('menu_link_content', $uuid);
              $tid = $entity->field_case_type[0]->target_id ?? NULL;
              if (in_array($tid, $node_tids)) {
                $active_trail = TRUE;
              }
            }

            $child_title = $link->getTitle();
            $child_url_obj = $link->getUrlObject();
            $child_url = $child_url_obj->toString();
            // Using both text/name & href/url ↓ due to inconsistencies in
            // Pattern Lab components.
            $children[] = [
              'text' => $child_title,
              'name' => $child_title,
              'href' => $child_url,
              'url' => $child_url,
              'is_current' => $active_trail,
            ];
          }
        }
      }

      // Using text/name & href/url ↓ due to inconsistencies in
      // Pattern Lab components.
      $menu_items[] = [
        'text' => $parent_title,
        'name' => $parent_title,
        'href' => $parent_url,
        'url' => $parent_url,
        'id' => Html::getId($parent_title),
        'links' => $children,
      ];
    }
  }

  return $menu_items;
}
