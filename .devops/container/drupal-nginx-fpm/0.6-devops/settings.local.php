<?php

// @codingStandardsIgnoreFile

/**
 * Set the default location for the 'private' directory.  Note
 * that this location is protected when running on the Pantheon
 * environment, but may be exposed if you migrate your site to
 * another environment.
 */
$settings['file_private_path'] = 'sites/default/files/private/' . $_ENV['SITE_MAP_ID'];
$settings['file_public_path']  = 'sites/default/files/' . $_ENV['SITE_MAP_ID'] . '/default';

//  Store local configuration separately so it isn't tracked by git.
$config['config_split.config_split.local']['status'] = TRUE;
$config['config_split.config_split.stage']['status'] = TRUE;

$databases['default']['default'] = array(
    'database' => $_ENV["DATABASE_NAME"],
    'username' => $_ENV["DATABASE_USER"],
    'password' => $_ENV["DATABASE_PASSWORD"],
    'host' => $_ENV["DATABASE_HOST"],
    'driver' => 'mysql',
    'port' => 3306,
    'prefix' => '',
);

if (isset($_ENV['REDIS_HOST'])) {
  $settings['redis.connection']['interface'] = 'PhpRedis';
  $settings['redis.connection']['host'] = $_ENV["REDIS_HOST"];
  $settings['redis.connection']['port'] = $_ENV["REDIS_PORT"] ?: '6379';
  $settings['redis.connection']['password'] = $_ENV["REDIS_PASSWORD"];
  $settings['cache']['default'] = 'cache.backend.redis';

  $settings['cache_prefix']['default'] = $_ENV['SITE_MAP_ID'];

  // Apply changes to the container configuration to better leverage Redis.
  // This includes using Redis for the lock and flood control systems, as well
  // as the cache tag checksum. Alternatively, copy the contents of that file
  // to your project-specific services.yml file, modify as appropriate, and
  // remove this line.
  $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

  // Allow the services to work before the Redis module itself is enabled.
  $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

  // Use redis for container cache.
  // The container cache is used to load the container definition itself, and
  // thus any configuration stored in the container itself is not available
  // yet. These lines force the container cache to use Redis rather than the
  // default SQL cache.
  $settings['bootstrap_container_definition'] = [
    'parameters' => [],
    'services' => [
      'redis.factory' => [
        'class' => 'Drupal\redis\ClientFactory',
      ],
      'cache.backend.redis' => [
        'class' => 'Drupal\redis\Cache\CacheBackendFactory',
        'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
      ],
      'cache.container' => [
        'class' => '\Drupal\redis\Cache\PhpRedis',
        'factory' => ['@cache.backend.redis', 'get'],
        'arguments' => ['container'],
      ],
      'cache_tags_provider.container' => [
        'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
        'arguments' => ['@redis.factory'],
      ],
      'serialization.phpserialize' => [
        'class' => 'Drupal\Component\Serialization\PhpSerialize',
      ],
    ],
  ];
}
