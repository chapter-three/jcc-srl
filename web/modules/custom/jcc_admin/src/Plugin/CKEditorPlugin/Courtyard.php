<?php

namespace Drupal\jcc_admin\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\Component\Plugin\PluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "Courtyard" plugin, with a CKEditor.
 *
 * @CKEditorPlugin(
 *   id = "courtyard",
 *   label = @Translation("Courtyard Components")
 * )
 */
class Courtyard extends PluginBase implements CKEditorPluginInterface, CKEditorPluginButtonsInterface {

  /**
   * {@inheritdoc}
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function isInternal() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'jcc_admin') . '/courtyard/plugin.js';
  }

  /**
   * @return array
   */
  public function getButtons() {
    $iconImage = drupal_get_path('module', 'jcc_admin') . '/courtyard/images/icon.png';

    return [
      'courtyard' => [
        'label' => t('Add Courtyard Components'),
        'image' => $iconImage,
      ]
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return [];
  }

}