<?php

namespace Drupal\jcc_admin\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\jcc_admin\Plugin\CKEditorPlugin\Courtyard;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "Courtyard External Button" plugin, with a CKEditor.
 *
 * @CKEditorPlugin(
 *   id = "externalbutton",
 *   label = @Translation("Courtyard External Button")
 * )
 */
class CourtyardExternalButton extends Courtyard {

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'jcc_admin') . '/courtyard/externalbutton.js';
  }

  /**
   * @return array
   */
  public function getButtons() {
    $iconImage = drupal_get_path('module', 'jcc_admin') . '/courtyard/images/externalbutton.png';

    return [
      'externalbutton' => [
        'label' => t('Add Courtyard External Button'),
        'image' => $iconImage,
      ]
    ];
  }
}
