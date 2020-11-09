<?php
namespace Drupal\jcc_forms\Plugin\views\style;
use Drupal\rest\Plugin\views\style\Serializer;

/**
 * The style plugin for serialized output formats.
 *
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "custom_serializer",
 *   title = @Translation("JCC Forms Custom Serializer"),
 *   help = @Translation("Customize form information as needed"),
 *   display_types = {"data"}
 * )
 */
class CustomSerializer extends Serializer {

  /**
   * {@inheritdoc}
   */
  public function render() {
    $rows = [];
    // If the Data Entity row plugin is used, this will be an array of entities
    // which will pass through Serializer to one of the registered Normalizers,
    // which will transform it to arrays/scalars. If the Data field row plugin
    // is used, $rows will not contain objects and will pass directly to the
    // Encoder.
    foreach ($this->view->result as $row_index => $row) {
      $this->view->row_index = $row_index;
      $render_row = $this->view->rowPlugin->render($row);
      $row = [];
      foreach ($render_row as $key=>$value) {
        // Suppress empty fields.
        if (!empty($value)) {
          // Group language variants as sub-array for easier consumption.
          // Language fields need to be aliased with 'Language_' prefix for identification.
          $prefix = 'Language_';
          if (stristr($key, $prefix)) {
            $key = substr($key, strlen($prefix));
            $row['other_languages'][$key] = $value;
          } else {
            $row[$key] = $value;
          }
        }
      }
      $rows[] = $row;
    }
    unset($this->view->row_index);

    // Get the content type configured in the display or fallback to the
    // default.
    if ((empty($this->view->live_preview))) {
      $content_type = $this->displayHandler->getContentType();
    }
    else {
      $content_type = !empty($this->options['formats']) ? reset($this->options['formats']) : 'json';
    }
    return $this->serializer->serialize($rows, $content_type, ['views_style_plugin' => $this]);
  }

}
