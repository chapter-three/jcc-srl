<?php

function atrium_preprocess_page(&$variables) {

  $current_path = \Drupal::service('path.current')->getPath();
  $path_segments = explode('/', $current_path);
  $eid = isset($path_segments[2]) ? $path_segments[2] : null;

  if ($path_segments[1] == 'media' || $path_segments[1] == 'node') {
    $entity_type = $path_segments[1];

    /** @var $entity \Drupal\media\Entity\Media */
    /** @var $entity \Drupal\node\Entity\Node */
    $entity = \Drupal::entityTypeManager()->getStorage($entity_type)->load($eid);

    if (isset($entity)) {
      $entity_bundle = $entity->bundle();
      $variables['entity_bundle'] = $entity_bundle;
    }
  }

}
