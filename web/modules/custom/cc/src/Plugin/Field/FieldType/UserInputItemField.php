<?php

namespace Drupal\cc\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\StringLongItem;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'cc_user_input_item' field type.
 *
 * @FieldType(
 *   id = "cc_user_input_item",
 *   label = @Translation("User input item"),
 *   description = @Translation("Reference-able text area (multiple rows)"),
 *   no_ui = TRUE,
 *   list_class = "\Drupal\cc\UserInputItemList",
 *   default_widget = "cc_user_input_item",
 *   default_formatter = "basic_string",
 * )
 */
class UserInputItemField extends StringLongItem {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = parent::propertyDefinitions($field_definition);
    $properties['id'] = DataDefinition::create('integer');
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = parent::schema($field_definition);
    $schema['columns']['id'] = [
      'type' => 'int',
      'not null' => TRUE,
      'default' => 0,
      'unsigned' => TRUE,
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public static function generateSampleValue(FieldDefinitionInterface $field_definition) {
    $values = parent::generateSampleValue($field_definition);
    $values['id'] = mt_rand();
    return $values;
  }

}
