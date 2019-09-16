#!/bin/bash

echo '\nInstalling PHP packages...'
cd ..; composer install; cd web

echo '\nRemoving old files and Extracting reference files if any...'
bash -c '[ -f ../reference/files.tar.gz ] && \n rm -rf sites/default/files/* && \n tar -xzf ../reference/files.tar.gz -C sites/default/files || exit 0'

echo '\nDropping the database...'
drush sql-drop -y

echo '\nImporting reference database...'
gunzip < ../reference/backup.sql.gz | sed '/INSERT INTO `cache.*` VALUES/d' | drush sql-cli

echo '\nSetting admin password...'
drush user-password 1 --password=admin
