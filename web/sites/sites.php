<?php

/**
 * @file
 * Sites routing map.
 */

// Dynamically handle Azure Site mapping.
if (isset($_ENV['SITE_MAP_DOMAINS'])
  && !empty($_ENV['SITE_MAP_DOMAINS'])
  && isset($_ENV['SITE_MAP_ID'])
  && !empty($_ENV['SITE_MAP_ID'])
  ) {

  $map_domains = explode(" ", $_ENV['SITE_MAP_DOMAINS']);
  foreach ($map_domains as $domain) {
    $sites[$domain] = $_ENV['SITE_MAP_ID'];
  }

}

// Local using Other.
// If you're not using Lando, place additional site definitions in
// sites.local.php next to this file. It will be ignored by git.
if (file_exists('./sites/sites.local.php')) {
  include './sites/sites.local.php';
}
