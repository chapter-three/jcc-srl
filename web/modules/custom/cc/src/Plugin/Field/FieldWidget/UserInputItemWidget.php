<?php

namespace Drupal\cc\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'cc_user_input_item' widget.
 *
 * @FieldWidget(
 *   id = "cc_user_input_item",
 *   module = "cc",
 *   label = @Translation("User input item"),
 *   field_types = {
 *     "cc_user_input_item"
 *   }
 * )
 */
class UserInputItemWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element['value'] = $element + [
      '#type' => 'textarea',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
      '#rows' => 2,
    ];
    $element['id'] = [
      '#type' => 'value',
      '#value' => isset($items[$delta]->id) ? $items[$delta]->id : NULL,
    ];

    return $element;
  }

}
