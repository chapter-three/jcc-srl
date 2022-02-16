<?php

namespace Drupal\jcc_autocomplete_helper\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

class AutocompleteRouteSubscriber extends RouteSubscriberBase {

  public function alterRoutes(RouteCollection $collection) {
    if ($route = $collection->get('system.entity_autocomplete')){
      $route->setDefault('_controller', '\Drupal\jcc_autocomplete_helper\Controller\JccEntityAutocompleteController::handleAutocomplete');
    }
  }

}
