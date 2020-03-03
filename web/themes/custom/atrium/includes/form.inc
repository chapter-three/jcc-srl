<?php

/**
 * @file
 * Theme and preprocess functions for forms.
 */

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

/**
 * Implements hook_preprocess_form_element().
 */
function atrium_preprocess_form_element(array &$variables) {
  if (!isset($variables['label'])) {
    return;
  }

  if (isset($variables['element']['#form_id'])) {
    $variables['label']['#form_id'] = $variables['element']['#form_id'];
  }
  if (isset($variables['element']['#type'])) {
    $variables['label']['#form_element_type'] = $variables['element']['#type'];
  }
}

/**
 * Implements hook_form_alter().
 */
function atrium_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  atrium_attach_form_id($form, $form_id);

  if (isset($form['#webform_id'])) {
    $form['#webform_id_trunc'] = $form['#webform_id'];

    foreach ($form as $key => $var) {
      if ($key == $form['#webform_id_trunc']) {

      }
    }
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function atrium_theme_suggestions_form_alter(array &$suggestions, array $variables) {
  if (isset($variables['element']['#form_id'])) {
    $suggestions[] = 'form__' . $variables['element']['#form_id'];
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function atrium_theme_suggestions_form_element_alter(array &$suggestions, array $variables) {
  $suggestions[] = 'form_element__type__' . $variables['element']['#type'];
  if (isset($variables['element']['#form_id'])) {
    $suggestions[] = 'form_element__form_id__' . $variables['element']['#form_id'];
    $suggestions[] = 'form_element__' . $variables['element']['#form_id'] . '__' . $variables['element']['#type'];
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function atrium_theme_suggestions_form_element_label_alter(array &$suggestions, array $variables) {
  if (isset($variables['element']['#form_element_type'])) {
    $suggestions[] = 'form_element_label__type__' . $variables['element']['#form_element_type'];
  }
  if (isset($variables['element']['#form_id'])) {
    $suggestions[] = 'form_element_label__form_id__' . $variables['element']['#form_id'];
  }
  if (isset($variables['element']['#form_element_type']) && isset($variables['element']['#form_id'])) {
    $suggestions[] = 'form_element_label__' . $variables['element']['#form_id'] . '__' . $variables['element']['#form_element_type'];
  }
}

/**
 * Attaches form id to all form elements.
 *
 * @param $form
 *   The form or form element which children should have form id attached.
 * @param $form_id
 *   The form id attached to form elements.
 *
 * @return array
 */
function atrium_attach_form_id(&$form, $form_id) {
  foreach (Element::children($form) as $child) {
    if (!isset($form[$child]['#form_id'])) {
      $form[$child]['#form_id'] = $form_id;
    }
    atrium_attach_form_id($form[$child], $form_id);
  }
}
