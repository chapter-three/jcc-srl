<?php

namespace Drupal\srl_webform\Plugin\WebformElement;

use Drupal\webform\Plugin\WebformElementBase;

/**
 * Provides a 'emailorphone' element.
 *
 * @WebformElement(
 *   id = "emailorphone",
 *   label = @Translation("Email or Phone"),
 *   description = @Translation("Provides a field that can accept email or phone."),
 *   category = @Translation("Advanced elements"),
 * )
 *
 * @see \Drupal\webform\Plugin\WebformElementBase
 * @see \Drupal\webform\Plugin\WebformElementInterface
 * @see \Drupal\webform\Annotation\WebformElement
 */
class WebformEmailOrPhone extends WebformElementBase {

}
