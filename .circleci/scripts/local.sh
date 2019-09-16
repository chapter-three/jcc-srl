#!/bin/bash

echo ''
echo 'Updating database...'
drush updatedb -y

echo ''
echo 'Rebuilding cache...'
drush cache-rebuild

echo ''
echo 'Importing configuration...'
drush config-import -y

echo ''
echo 'Applying pending entity schema updates...'
drush entity-updates -y
