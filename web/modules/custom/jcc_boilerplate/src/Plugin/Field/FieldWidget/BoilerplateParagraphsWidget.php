<?php

namespace Drupal\jcc_boilerplate\Plugin\Field\FieldWidget;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\paragraphs\Plugin\Field\FieldWidget\InlineParagraphsWidget;

/**
 * Plugin implementation of the 'boilerplate_paragraphs_widget' widget.
 *
 * @FieldWidget(
 *   id = "boilerplate_paragraphs_widget",
 *   module = "jcc_boilerplate",
 *   label = @Translation("Boilerplate Paragraphs"),
 *   field_types = {
 *     "entity_reference_revisions"
 *   }
 * )
 */
class BoilerplateParagraphsWidget extends InlineParagraphsWidget {

  /**
   * Builds dropdown button for adding new paragraph.
   *
   * @return array
   *   The form element array.
   */
  protected function buildButtonsAddMode() {
    // Hide the button when translating.
    $add_more_elements = [
      '#type' => 'container',
      '#theme_wrappers' => ['paragraphs_dropbutton_wrapper'],
    ];
    $field_name = $this->fieldDefinition->getName();
    $title = $this->fieldDefinition->getLabel();

    $drop_button = FALSE;
    if (count($this->getAccessibleOptions()) > 1 && $this->getSetting('add_mode') == 'dropdown') {
      $drop_button = TRUE;
      $add_more_elements['#theme_wrappers'] = ['dropbutton_wrapper'];
      $add_more_elements['prefix'] = [
        '#markup' => '<ul class="dropbutton">',
        '#weight' => -999,
      ];
      $add_more_elements['suffix'] = [
        '#markup' => '</ul>',
        '#weight' => 999,
      ];
      $add_more_elements['#suffix'] = $this->t(' to %type', ['%type' => $title]);
    }


    foreach ($this->getAccessibleOptions() as $machine_name => $label) {
      $add_more_elements['add_more_button_' . $machine_name] = [
        '#type' => 'submit',
        '#name' => strtr($this->fieldIdPrefix, '-', '_') . '_' . $machine_name . '_add_more',
        '#value' => $this->t('Add @type', ['@type' => $label]),
        '#attributes' => ['class' => ['field-add-more-submit']],
        '#limit_validation_errors' => [array_merge($this->fieldParents, [$field_name, 'add_more'])],
        '#submit' => [[get_class($this), 'addMoreSubmit']],
        '#ajax' => [
          'callback' => [get_class($this), 'addMoreAjax'],
          'wrapper' => $this->fieldWrapperId,
          'effect' => 'fade',
        ],
        '#bundle_machine_name' => $machine_name,
      ];

      if ($drop_button) {
        $add_more_elements['add_more_button_' . $machine_name]['#prefix'] = '<li>';
        $add_more_elements['add_more_button_' . $machine_name]['#suffix'] = '</li>';
      }
    }

    // Add Boilerplate button.
    $add_more_elements['boilerplate'] = [
      '#type' => "submit",
      '#name' => strtr($this->fieldIdPrefix, '-', '_') . '_' . $machine_name . '_add_more',
      '#attributes' => ['class' => ['field-add-more-submit']],
      '#value' => $this->t('Add Boilerplate Steps'),
      '#limit_validation_errors' => [array_merge($this->fieldParents, [$field_name, 'add_more'])],
      '#submit' => [[get_class($this), 'addMoreBoilerplateSubmit']],
      '#ajax' => [
        'callback' => [get_class($this), 'addMoreAjax'],
        'wrapper' => $this->fieldWrapperId,
        'effect' => 'fade',
      ],
      '#bundle_machine_name' => $machine_name,
    ];

    return $add_more_elements;
  }

  /**
   * {@inheritdoc}
   */
  public static function addMoreBoilerplateSubmit(array $form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();

    // Go one level up in the form, to the widgets container.
    $element = NestedArray::getValue($form, array_slice($button['#array_parents'], 0, -2));
    $field_name = $element['#field_name'];
    $parents = $element['#field_parents'];

    $widget_state = static::getWidgetState($parents, $field_name, $form_state);

    // @todo make items_count dynamic based on Boilerplate properties.
    $widget_state['items_count'] = $widget_state['real_item_count'] + 5;

    if (isset($button['#bundle_machine_name'])) {
      $widget_state['selected_bundle'] = $button['#bundle_machine_name'];
    }
    else {
      $widget_state['selected_bundle'] = $element['add_more']['add_more_select']['#value'];
    }

    static::setWidgetState($parents, $field_name, $form_state, $widget_state);

    $form_state->setRebuild();
  }
}
