<?php

namespace Drupal\srl_webform;

/**
 * Class PhoneValidatorService.
 */
class PhoneValidatorService {

  /**
   * Validates an email address.
   *
   * @param string $email
   *   A string containing an email address.
   * @param \Egulias\EmailValidator\Validation\EmailValidation|null $email_validation
   *   This argument is ignored. If it is supplied an error will be triggered.
   *   See https://www.drupal.org/node/2997196.
   *
   * @return bool
   *   TRUE if the address is valid.
   */
  public function isValid($phone) {
    return preg_match("/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/", $phone) ? true : false;
  }
}
