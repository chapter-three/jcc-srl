#!/bin/bash

# Prep the site for local development after importing a db from production or elsewhere.
#
# This file can be committed to your repo so it's available for all devs.
# Place it in a scripts/ directory inside your project repo (BESIDE your web/ docroot).
#
# This provides defaults. Customize this script for your project as needed.

# Run updates.
echo
echo -e "\033[33mRunning db updates.\033[0m"
drush updb -y

# Import Config.
echo
echo -e "\033[33mImporting Config.\033[0m"
drush cim -y

# Clear Caches
echo
echo -e "\033[33mClearing Caches.\033[0m"
drush cr

# Admin Login Link
echo
echo -e "\033[33mGenerating Login Link\033[0m"
drush uli
