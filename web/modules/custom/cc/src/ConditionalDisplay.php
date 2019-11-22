<?php

namespace Drupal\cc;

use Drupal;
use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Core\Entity\TranslatableInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Language\Language;
use Exception;

/**
 * A conditional display for a field.
 */
class ConditionalDisplay {

  /**
   * The host entity.
   *
   * @var \Drupal\Core\Entity\ContentEntityBase
   */
  protected $hostEntity;

  /**
   * The host entity field name.
   *
   * @var string
   */
  protected $fieldName;

  /**
   * The sequence number for the host entity field.
   *
   * @var int
   */
  protected $fieldDelta;

  /**
   * Settings.
   *
   * @var array
   */
  protected $settings = [
    'require_input' => TRUE,
  ];

  /**
   * Conditions.
   *
   * @var \Drupal\cc\Conditions
   */
  protected $conditions;

  /**
   * Get the host entity.
   *
   * @return \Drupal\Core\Entity\ContentEntityInterface
   *   The host entity.
   */
  public function getHostEntity() {
    return $this->hostEntity;
  }

  /**
   * Set the host entity.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $hostEntity
   *   The host entity.
   *
   * @return \self
   *   For chaining.
   */
  public function setHostEntity(ContentEntityInterface $hostEntity) {
    $this->hostEntity = $hostEntity;
    return $this;
  }

  /**
   * Get the host entity field name.
   *
   * @return string
   *   The host entity field name.
   */
  public function getFieldName() {
    return $this->fieldName;
  }

  /**
   * Set the host entity field name.
   *
   * @param string $fieldName
   *   The host entity field name.
   *
   * @return \self
   *   For chaining.
   */
  public function setFieldName(string $fieldName) {
    $this->fieldName = $fieldName;
    return $this;
  }

  /**
   * Get the sequence number for the host entity field.
   *
   * @return int
   *   The sequence number for the host entity field.
   */
  public function getFieldDelta() {
    return $this->fieldDelta;
  }

  /**
   * Set the sequence number for the host entity field.
   *
   * @param int $fieldDelta
   *   The sequence number for the host entity field.
   *
   * @return \self
   *   For chaining.
   */
  public function setFieldDelta(int $fieldDelta) {
    $this->fieldDelta = $fieldDelta;
    return $this;
  }

  /**
   * Get setting.
   *
   * @param string|int $key
   *   A key.
   *
   * @return mixed
   *   The setting value, or NULL if not found.
   */
  public function getSetting($key) {
    return @$this->settings[$key];
  }

  /**
   * Set settings.
   *
   * @param string $key
   *   A key.
   * @param mixed $value
   *   A value.
   *
   * @return \Drupal\cc\ConditionalDisplay
   *   For chaining.
   */
  public function setSetting($key, $value) {
    $this->settings[$key] = $value;
    return $this;
  }

  /**
   * Get conditions.
   *
   * @return \Drupal\cc\Conditions
   *   The conditions.
   */
  public function getConditions() {
    return $this->conditions;
  }

  /**
   * Set conditions.
   *
   * @param \Drupal\cc\Conditions $conditions
   *   The conditions.
   *
   * @return ConditionalDisplay
   *   For chaining.
   */
  public function setConditions(Conditions $conditions) {
    $this->conditions = $conditions;
    return $this;
  }

  /**
   * ConditionalDisplay constructor.
   *
   * @param \Drupal\Core\Entity\ContentEntityInterface $host_entity
   *   The host entity.
   * @param string $field_name
   *   The host entity field name.
   * @param int $field_delta
   *   The sequence number for the host entity field.
   *
   * @throws \Exception
   */
  public function __construct(
    ContentEntityInterface $host_entity,
    string $field_name,
    int $field_delta
  ) {
    $this->hostEntity = $host_entity;
    $this->fieldName = $field_name;
    $this->fieldDelta = $field_delta;
    $this->load();
  }

  /**
   * Gets revision id of an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $host_entity
   *   An entity.
   *
   * @return int
   *   An id.
   */
  public static function getHostEntityRevisionId(EntityInterface $host_entity) {
    if ($host_entity instanceof RevisionableInterface) {
      return $host_entity->getRevisionId();
    }
    return $host_entity->id();
  }

  /**
   * Gets language code of an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $host_entity
   *   An entity.
   *
   * @return string
   *   An id.
   */
  public static function getHostEntityLanguageId(EntityInterface $host_entity) {
    if ($host_entity instanceof TranslatableInterface) {
      return $host_entity->language()->getId();
    }
    return Language::LANGCODE_DEFAULT;
  }

  /**
   * Gets all conditional displays for a host entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $host_entity
   *   The host entity.
   *
   * @return \Drupal\cc\ConditionalDisplay[]
   *   Array of conditional display objects.
   *
   * @throws \Exception
   */
  public static function getEntityConditionalDisplays(EntityInterface $host_entity) {
    $database = Drupal::database();
    $query = $database
      ->select('cc_field_conditions', 'fc')
      ->fields('fc', ['field', 'delta']);
    $query->condition('fc.entity_type', $host_entity->getEntityTypeId());
    $query->condition('fc.entity_id', $host_entity->id());
    $query->condition('fc.revision_id', self::getHostEntityRevisionId($host_entity));
    $query->condition('fc.langcode', self::getHostEntityLanguageId($host_entity));
    $query->orderBy('fc.field');
    $query->orderBy('fc.delta');
    $ccs = [];
    foreach ($query->execute() as $row) {
      /** @var \Drupal\Core\Entity\ContentEntityInterface $host_entity */
      $ccs[] = new ConditionalDisplay(
        $host_entity, $row->field, $row->delta);
    }
    return $ccs;
  }

  /**
   * Bulk deletes conditional displays.
   *
   * @param \Drupal\Core\Entity\EntityInterface $host_entity
   *   A host entity.
   * @param int $revision_id
   *   An optional revision id to limit the deletion to.
   * @param string $language_code
   *   An optional language code to limit the deletion to.
   *
   * @return int
   *   The number of rows affected by the delete query.
   */
  public static function deleteEntityConditionalDisplays(
    EntityInterface $host_entity,
    $revision_id = NULL,
    $language_code = NULL
  ) {
    $database = Drupal::database();
    $query = $database
      ->delete('cc_field_conditions');
    $query->condition('entity_type', $host_entity->getEntityTypeId());
    $query->condition('entity_id', $host_entity->id());
    if ($revision_id) {
      $query->condition('revision_id', $revision_id);
    }
    if ($language_code) {
      $query->condition('langcode', $language_code);
    }
    return $query->execute();
  }

  /**
   * Bulk deletes conditional displays for a language.
   *
   * @param string $language_code
   *   Language code.
   *
   * @return int
   *   The number of rows affected by the delete query.
   */
  public static function deleteLanguageConditionalDisplays($language_code) {
    $database = Drupal::database();
    $query = $database
      ->delete('cc_field_conditions');
    $query->condition('langcode', $language_code);
    return $query->execute();
  }

  /**
   * Get conditions.
   *
   * @param bool $reset
   *   Re-load from database.
   *
   * @return $this
   *   For chaining.
   *
   * @throws \Exception
   */
  public function load($reset = FALSE) {
    if (empty($this->conditions) || $reset) {
      $database = Drupal::database();
      $query = $database
        ->select('cc_field_conditions', 'fc')
        ->fields('fc', ['settings', 'conditions']);
      $query->condition('fc.entity_type', $this->hostEntity->getEntityTypeId());
      $query->condition('fc.entity_id', $this->hostEntity->id());
      $query->condition('fc.revision_id', self::getHostEntityRevisionId($this->hostEntity));
      $query->condition('fc.langcode', self::getHostEntityLanguageId($this->hostEntity));
      $query->condition('fc.field', $this->fieldName);
      $query->condition('fc.delta', $this->fieldDelta);
      $result = $query->execute();
      if ($row = $result->fetchObject()) {
        $this->settings = unserialize($row->settings);
        $this->conditions = unserialize($row->conditions);
      }
      else {
        $this->conditions = new Conditions();
      }
    }
    return $this;
  }

  /**
   * Save conditions.
   *
   * @return \self
   *   For chaining.
   *
   * @throws \Exception
   *   Database exception.
   */
  public function save() {
    $database = Drupal::database();
    $database
      ->merge('cc_field_conditions')
      ->keys([
        'entity_type' => $this->hostEntity->getEntityTypeId(),
        'entity_id' => $this->hostEntity->id(),
        'revision_id' => self::getHostEntityRevisionId($this->hostEntity),
        'langcode' => self::getHostEntityLanguageId($this->hostEntity),
        'field' => $this->fieldName,
        'delta' => $this->fieldDelta,
      ])
      ->fields([
        'settings' => serialize($this->settings),
        'conditions' => serialize($this->conditions),
      ])
      ->execute();
    return $this;
  }

  /**
   * Delete conditions.
   *
   * @return \self
   *   For chaining.
   */
  public function delete() {
    $database = Drupal::database();
    $query = $database
      ->delete('cc_field_conditions');
    $query->condition('entity_type', $this->hostEntity->getEntityTypeId());
    $query->condition('entity_id', $this->hostEntity->id());
    $query->condition('revision_id', self::getHostEntityRevisionId($this->hostEntity));
    $query->condition('langcode', self::getHostEntityLanguageId($this->hostEntity));
    $query->condition('field', $this->fieldName);
    $query->condition('delta', $this->fieldDelta);
    $query->execute();
    return $this;
  }

  /**
   * Get parameters.
   */
  public function getParameters() {
    $parameter_fields = [];
    foreach ($this->hostEntity->getFieldDefinitions() as $fieldDefinition) {
      switch ($fieldDefinition->getType()) {

        case 'entity_reference':
        case 'entity_reference_revisions':
          if ($fieldDefinition->getSetting('target_type') == 'cc_user_input') {
            $field_name = $fieldDefinition->getName();
            $field = $this->hostEntity->get($field_name);
            /** @var \Drupal\cc\Entity\UserInput $user_input */
            foreach ($field->referencedEntities() as $user_input) {
              $parameter_fields[$field_name][$user_input->id()] = [
                'label' => $user_input->label(),
                'options' => $user_input->getInputItemsOptions(),
              ];
            }
          }
          break;

      }
    }
    return $parameter_fields;
  }

  /**
   * Get parameter label.
   */
  public function getParameterLabel($entity_id) {
    foreach ($this->getParameters() as $field_name => $values) {
      foreach ($values as $id => $value) {
        if ($id == $entity_id) {
          return $value['label'];
        }
      }
    }
    return NULL;
  }

  /**
   * Get parameter entities as select #options array.
   */
  public function getParameterKeysOptions() {
    $options = [];
    foreach ($this->getParameters() as $field_name => $values) {
      foreach ($values as $id => $value) {
        $options[$id] = $value['label'];
      }
    }
    return $options;
  }

  /**
   * Get parameter entity values as select #options array.
   */
  public function getParameterValuesOptions($entity_id) {
    $options = [];
    foreach ($this->getParameters() as $field_name => $values) {
      foreach ($values as $id => $value) {
        if ($id == $entity_id) {
          foreach ($value['options'] as $key => $option) {
            $options[$key] = $option;
          }
          break;
        }
      }
    }
    return $options;
  }

  /**
   * Tests if an element is generated by ConditionalDisplay::getWidgetElement().
   *
   * @param array $element
   *   Form API element.
   *
   * @return bool
   *   Is our widget.
   */
  public static function isConditionalDisplayWidgetElement(array &$element) {
    return !(
      empty($element['cc']) ||
      empty($element['cc']['host_entity']) ||
      empty($element['cc']['field_name']) ||
      empty($element['cc']['field_delta'])
    );
  }

  /**
   * Get widget form element for modifying a field conditions.
   *
   * @return array
   *   FAPI element array.
   *
   * @throws \Exception
   */
  public function getWidgetElement(array &$form, FormStateInterface $form_state) {

    $prefix = implode('-', [
      'cc',
      $this->getHostEntity()->id(),
      $this->fieldName,
      $this->fieldDelta,
    ]);
    $wrapper_id = Html::getUniqueId($prefix . '-add-more-wrapper');

    $element = [
      '#tree' => TRUE,
      '#type' => 'fieldset',
      '#title' => t('Conditional display'),
      '#prefix' => "<div id=\"$wrapper_id\">",
      '#suffix' => '</div',
      '#element_validate' => [[get_class($this), 'validateParametersElement']],
      'host_entity' => [
        '#type' => 'value',
        '#value' => $this->hostEntity->id(),
      ],
      'field_name' => [
        '#type' => 'value',
        '#value' => $this->fieldName,
      ],
      'field_delta' => [
        '#type' => 'value',
        '#value' => $this->fieldDelta,
      ],
      'require_input' => [
        '#type' => 'checkbox',
        '#title' => t('Require user input'),
        '#description' => t('Hide when there is no user input.'),
        '#default_value' => $this->getSetting('require_input'),
        '#weight' => 1,
      ],
    ];

    $condition_elements = function (
      Conditions $conditions,
      $prefix
    ) use (
      &$condition_elements,
      $wrapper_id
    ) {
      $element = [
        '#type' => 'fieldset',
      ];
      if (count($conditions->getConditions())) {
        $element['operator'] = [
          '#type' => 'select',
          '#title' => t('Operator'),
          '#options' => Conditions::getOperatorOptions(),
          '#default_value' => $conditions->getOperator(),
          '#weight' => -1,
        ];
      }
      else {
        $element['operator'] = [
          '#type' => 'value',
          '#value' => $conditions->getOperator(),
        ];
      }
      /** @var array|\Drupal\cc\Conditions $condition */
      foreach ($conditions->getConditions() as $i => $condition) {
        if ($condition instanceof Conditions) {
          $element[$i] = $condition_elements($condition, $prefix . '-' . $i);
        }
        else {
          $element[$i] = [
            '#type' => 'fieldset',
            '#title' => $this->getParameterLabel($condition['id']),
            'id' => [
              '#type' => 'value',
              '#value' => $condition['id'],
            ],
            'operator' => [
              '#type' => 'select',
              '#options' => Conditions::getConditionOperatorOptions(),
              '#default_value' => $condition['operator'],
            ],
            'condition' => [
              '#type' => 'checkboxes',
              '#options' => $this->getParameterValuesOptions($condition['id']),
              '#default_value' => $condition['value'],
            ],
            'remove' => [
              '#type' => 'submit',
              '#value' => t('Remove'),
              // @see https://www.drupal.org/node/1342066
              '#name' => strtr($prefix, '-', '_') . '_remove',
              '#submit' => [[get_class($this), 'removeConditionSubmit']],
              '#ajax' => [
                'callback' => [get_class($this), 'removeConditionAjax'],
                'wrapper' => $wrapper_id,
                'effect' => 'fade',
              ],
            ],
          ];
        }
      }
      $element['add_more'] = [
        'add_more_parameter' => [
          '#type' => 'select',
          '#options' => $this->getParameterKeysOptions(),
        ],
        'add_more_submit' => [
          '#type' => 'submit',
          '#value' => t('Add condition'),
          // @see https://www.drupal.org/node/1342066
          '#name' => strtr($prefix, '-', '_') . '_add_more',
          '#submit' => [[get_class($this), 'addConditionSubmit']],
          '#ajax' => [
            'callback' => [get_class($this), 'addConditionAjax'],
            'wrapper' => $wrapper_id,
            'effect' => 'fade',
          ],
        ],
      ];
      return $element;
    };

    $element += $condition_elements($this->getConditions(), $prefix);
    return $element;
  }

  /**
   * Gets widget state.
   */
  public static function getElementWidgetState(&$element, FormStateInterface $form_state) {
    return self::getWidgetState($element['host_entity']['#value'],
      $element['field_name']['#value'], $element['field_delta']['#value'],
      $form_state);
  }

  /**
   * Sets widget state.
   */
  public static function setElementWidgetState(&$element, FormStateInterface $form_state, $value) {
    self::setWidgetState($element['host_entity']['#value'],
      $element['field_name']['#value'], $element['field_delta']['#value'],
      $form_state, $value);
  }

  /**
   * Gets widget state.
   */
  public static function getWidgetState($entity_id, $field_name, $delta, FormStateInterface $form_state) {
    $parents = ['cc', $entity_id, $field_name, $delta];
    return NestedArray::getValue($form_state->getStorage(), $parents);
  }

  /**
   * Sets widget state.
   */
  public static function setWidgetState($entity_id, $field_name, $delta, FormStateInterface $form_state, $value) {
    $parents = ['cc', $entity_id, $field_name, $delta];
    NestedArray::setValue($form_state->getStorage(), $parents, $value);
  }

  /**
   * Parameter #element_validate callback.
   *
   * @see getWidgetElement()
   */
  public static function validateParametersElement($element, FormStateInterface $form_state) {
  }

  /**
   * Add condition #submit callback.
   *
   * @throws \Exception
   */
  public static function addConditionSubmit(array &$form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();
    $i = -3;
    while ($widget_element = NestedArray::getValue($form, array_slice($button['#array_parents'], 0, $i))) {
      if ($widget_element['cc']) {
        $element = $widget_element['cc'];
        $cc = self::processElement($element, $form, $form_state);
        // @todo handle nested.
        $value = $form_state
          ->getValue([$cc->getFieldName(), $cc->getFieldDelta(), 'cc']);
        $cc->getConditions()->addCondition($value['add_more']['add_more_parameter']);
        $form_state->setRebuild();
        break;
      }
      else {
        // @todo handle nested.
        throw new Exception('nested conditions not yet implemented.');
      }
    }
  }

  /**
   * Add condition #ajax callback.
   *
   * @throws \Exception
   */
  public static function addConditionAjax(array &$form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();
    $i = -3;
    while ($widget_element = NestedArray::getValue($form, array_slice($button['#array_parents'], 0, $i))) {
      if ($widget_element['cc']) {
        return $widget_element['cc'];
      }
      // @todo handle nested.
      throw new Exception('nested conditions not yet implemented.');
    }
    return NULL;
  }

  /**
   * Remove condition #submit callback.
   *
   * @throws \Exception
   */
  public static function removeConditionSubmit(array &$form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();
    $i = -3;
    while ($widget_element = NestedArray::getValue($form, array_slice($button['#array_parents'], 0, $i))) {
      if ($widget_element['cc']) {
        $element = $widget_element['cc'];
        $cc = self::processElement($element, $form, $form_state);
        $parents = array_slice(
          $button['#parents'],
          count($element['#array_parents']) - 1,
          -1);
        $cc->getConditions()->removeCondition($parents);
        $form_state->setRebuild();
        break;
      }
      else {
        // @todo handle nested.
        throw new Exception('nested conditions not yet implemented.');
      }
    }
  }

  /**
   * Remove condition #ajax callback.
   *
   * @throws \Exception
   */
  public static function removeConditionAjax(array &$form, FormStateInterface $form_state) {
    $button = $form_state->getTriggeringElement();
    $i = -3;
    while ($widget_element = NestedArray::getValue($form, array_slice($button['#array_parents'], 0, $i))) {
      if ($widget_element['cc']) {
        return $widget_element['cc'];
      }
      // @todo handle nested.
      throw new Exception('nested conditions not yet implemented.');
    }
    return NULL;
  }

  /**
   * Updates a ConditionalDisplay from a form submission.
   *
   * @param array $element
   *   The widget element from getWidgetElement().
   * @param array $form
   *   The Form API form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The Form API form state object.
   *
   * @return \Drupal\cc\ConditionalDisplay
   *   The updated ConditionalDisplay object.
   *
   * @throws \Exception
   */
  public static function processElement(
    array &$element,
    array &$form,
    FormStateInterface $form_state
  ) {
    $field_name = $element['#array_parents'][count($element['#array_parents']) - 4];
    $delta = $element['#array_parents'][count($element['#array_parents']) - 2];
    $parents = [$field_name, $delta, 'cc'];

    $widget_state = ConditionalDisplay::getElementWidgetState($element, $form_state);
    /** @var \Drupal\cc\ConditionalDisplay $cc */
    $cc = $widget_state['entity'];

    foreach (['require_input'] as $key) {
      $cc->setSetting($key, $form_state->getValue($parents)['require_input']);
    }

    $process_conditions = function (&$element, $path) use ($form_state) {
      $value = $form_state->getValue(array_merge($path));
      if ($value['operator']) {
        $condition = new Conditions($value['operator']);
        $i = 0;
        while (@$value[$i]) {
          // @todo conditions, nested conditions.
          if (@$value[$i]['id']) {
            $condition->addCondition($value[$i]['id'],
              $value[$i]['operator'], $value[$i]['condition']);
          }
          $i++;
        }
        return $condition;
      }
      return NULL;
    };

    $cc->setConditions($process_conditions($element, $parents));

    return $cc;
  }

}
