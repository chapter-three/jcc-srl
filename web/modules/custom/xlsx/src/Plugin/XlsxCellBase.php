<?php

namespace Drupal\xlsx\Plugin;

use Drupal\Component\Plugin\PluginBase;

/**
 * XlsxCell plugin base class.
 *
 * @package xlsx
 */
class XlsxCellBase extends PluginBase implements XlsxCellInterface {

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return $this->pluginDefinition['name'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->pluginDefinition['description'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFieldTypes() {
    return $this->pluginDefinition['field_types'];
  }

  /**
   * {@inheritdoc}
   */
  public function import($entity, $field_name, $value, $mapped_fields, $data_array, $worksheet_index) {
    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function export($entity, $field_name, $value) {
    return $value;
  }

}
