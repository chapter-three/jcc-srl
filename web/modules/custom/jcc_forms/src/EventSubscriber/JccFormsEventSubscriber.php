<?php

namespace Drupal\jcc_forms\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class JccFormsEventSubscriber implements EventSubscriberInterface {

  /**
  * Set header 'Content-Security-Policy' to response to allow embedding in iFrame.
  */
  public function setHeaderContentSecurityPolicy(ResponseEvent $event) {
    $response = $event->getResponse();
    $response->headers->remove('X-Frame-Options');
    $response->headers->set('Content-Security-Policy', "frame-ancestors 'self' courts.ca.gov *.courts.ca.gov develop-jcc-appellate.pantheonsite.io stage-jcc-appellate.pantheonsite.io live-jcc-appellate.pantheonsite.io develop-jcc-supremecourt.pantheonsite.io stage-jcc-supremecourt.pantheonsite.io", FALSE);
  }

  /**
  * {@inheritdoc}
  */
  static function getSubscribedEvents() {
  // Response: set header content security policy
  $events[KernelEvents::RESPONSE][] = ['setHeaderContentSecurityPolicy', -10];

  return $events;
  }

}
