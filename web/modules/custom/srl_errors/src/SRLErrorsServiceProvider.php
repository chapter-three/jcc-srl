<?php


namespace Drupal\srl_errors;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Drupal\Core\DependencyInjection\ServiceProviderInterface;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Overrides the form_error_handler service to modify error behavior.
 */
class SRLErrorsServiceProvider extends ServiceProviderBase implements ServiceProviderInterface {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    $container->getDefinition('form_error_handler')
      ->setClass('Drupal\srl_errors\SRLErrorsFormErrorHandler')
      ->setArguments([
        new Reference('string_translation'),
        new Reference('renderer'),
        new Reference('messenger'),
      ]);
  }
}
