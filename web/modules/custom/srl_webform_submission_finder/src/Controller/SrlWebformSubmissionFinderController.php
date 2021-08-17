<?php

namespace Drupal\srl_webform_submission_finder\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use \Drupal\webform\Entity\WebformSubmission;

class SrlWebformSubmissionFinderController {
  function customRedirect(string $sid) {
      $submission = WebformSubmission::load($sid);
      if(!is_null($submission)){
        $submission_uuid = $submission->get('uuid')->getValue();
        return new RedirectResponse('/webform_rest/was_this_information_helpful_/submission/' . $submission_uuid[0]['value'] . '?_format=json');
      } else {
        return [
          '#markup' => 'Export failed for sid : ' . $sid ,
        ];
      }
  }
}
