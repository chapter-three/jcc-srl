<?php

namespace Drupal\srl_webform\Element;

use Drupal\Core\Render\Element;
use Drupal\Core\Render\Element\FormElement;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'emailorphone'.
 *
 * @FormElement("emailorphone")
 *
 * @see \Drupal\Core\Render\Element\FormElement
 * @see https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Render%21Element%21FormElement.php/class/FormElement
 * @see \Drupal\Core\Render\Element\RenderElement
 * @see https://api.drupal.org/api/drupal/namespace/Drupal%21Core%21Render%21Element
 */
class WebformEmailOrPhone extends FormElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $class = get_class($this);
    return [
      '#input' => TRUE,
      '#size' => 60,
      '#process' => [
        [$class, 'processWebformElementExample'],
        [$class, 'processAjaxForm'],
      ],
      '#element_validate' => [
        [$class, 'validateWebformExampleElement'],
      ],
      '#pre_render' => [
        [$class, 'preRenderWebformExampleElement'],
      ],
      '#theme' => 'input__webform_example_element',
      '#theme_wrappers' => ['form_element'],
    ];
  }

  /**
   * Processes a 'webform_example_element' element.
   */
  public static function processWebformElementExample(&$element, FormStateInterface $form_state, &$complete_form) {
    // Here you can add and manipulate your element's properties and callbacks.
    return $element;
  }

  /**
   * Webform element validation handler for #type 'webform_example_element'.
   */
  public static function validateWebformExampleElement(&$element, FormStateInterface $form_state, &$complete_form) {
    $value = trim($element['#value']);
    $form_state->setValueForElement($element, $value);

    if ($value !== '') {
      if (
        !(\Drupal::service('email.validator')->isValid($value) ||
        \Drupal::service('srl_webform.usphone.validator')->isValid($value)
      )) {
        $form_state->setError($element, t('The email or phone  address %mail is not valid.', ['%mail' => $value]));

      }
    }

  }

  /**
   * Prepares a #type 'email_multiple' render element for theme_element().
   *
   * @param array $element
   *   An associative array containing the properties of the element.
   *   Properties used: #title, #value, #description, #size, #maxlength,
   *   #placeholder, #required, #attributes.
   *
   * @return array
   *   The $element with prepared variables ready for theme_element().
   */
  public static function preRenderWebformExampleElement(array $element) {
    $element['#attributes']['type'] = 'text';
    Element::setAttributes($element, ['id', 'name', 'value', 'size', 'maxlength', 'placeholder']);
    static::setAttributes($element, ['form-text', 'webform-example-element']);
    return $element;
  }

}
