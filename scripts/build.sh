#!/bin/bash

set -e

clean=false
confirmed=false
composer_install=true
db_drop=false
db_file=false
production_build=""
theme_name="atrium"
theme_build=false
watch=false

# Basic yes/no prompt handler.
# TODO: separate this into a helper.sh so it can be included in other scripts.
prompt_yes_no() {
  while true ; do
    printf "$* [yes/No] "
    read answer
    if [ -z "$answer" ] ; then
      return 1
    fi
    case $answer in
      [Yy][Ee][Ss])
        return 0
        ;;
      [Nn][Oo])
        return 1
        ;;
      *)
        echo "Please answer yes or no"
        ;;
    esac
  done
}

while getopts ":cltwy" opt; do
  case $opt in
    c )
      echo
      echo "-c Clean build."
      clean=true
      ;;
    l )
      echo
      echo "-l (live) Build production code."
      production_build="--no-dev"
      ;;
    t )
      theme_build=true
      echo
      echo "-t Theme build for: $OPTARG"
      theme=$OPTARG
      ;;
    w )
      echo
      echo "-w Running theme watcher"
      watch=true
      ;;
    y )
      confirmed=true
      ;;
    \?)
      echo
      echo "Invalid option: -$OPTARG"
      exit 1
      ;;
    :)
      echo
      echo "Option -$OPTARG requires an argument."
      exit 1
      ;;
  esac
done
shift $((OPTIND-1))

# Check for existing build and confirm rebuild.
if [ "$clean" = true ] ; then
  if [ "$confirmed" = false ] ; then
    echo
    if prompt_yes_no "Do you want to destroy the current composer install and rebuild from composer.json?" ; then
      clean=true
    else
      echo
      echo "Installing without destroying first."
      clean=false
    fi
  fi
fi

if [ "$clean" = true ] ; then
  # Destroy Stuff.
  echo
  echo "Destroying Stuff..."

  echo
  echo "Removing dependencies, core and contrib for rebuild..."
  rm -rf /app/vendor/ \
    /app/web/core/ \
    /app/web/modules/contrib/ \
    /app/web/themes/contrib/ \
    /app/web/profiles/contrib/
fi

# Run composer install.
if [ "$confirmed" = false ] ; then
  if [ "$theme_build" = false ] ; then
    echo
    if prompt_yes_no "Ready to run composer install?" ; then
      echo ok
      composer_install=true
    else
      echo
      echo "Exiting."
      exit 0
    fi
  fi
fi

if [ "$theme_build" = false ] ; then
  if [ "$composer_install" = true ] ; then
    echo
    echo "Running composer install."
    if [[ -e /.dockerenv ]] ; then
      echo "... inside container."
      cd /app
      composer install $production_build
    else
      echo
      echo "... with lando composer install."
      lando composer install $production_build
    fi
  fi
fi

# Build the theme.
if [ "$theme_build" = true ] ; then
  echo
  echo "Starting theme build..."
  if [[ -e /.dockerenv ]] ; then
    echo "... inside container."
    cd /app/web/themes/custom/$theme_name
    pwd
    if [[ -d /app/web/themes/$theme_name/node_modules ]] ; then
      echo
      echo "Build tools detected."
    else
      echo
      echo "No build tools detected. Installing"
      echo
      echo "THIS IS NOT CONFIGURED YET. SEE scripts/build.sh"

    fi
    if [ "$watch" = false ] ; then
      echo
      echo "Running theme build"
      echo
      echo "THIS IS NOT CONFIGURED YET. SEE scripts/build.sh"
    else
      echo
      echo "Running watcher"
      echo
      echo "THIS IS NOT CONFIGURED YET. SEE scripts/build.sh"
    fi
  else
    echo
    echo "Theme must be built with tools inside the container."
    echo "Trying lando build:theme"
    lando build:theme $theme
  fi
fi

echo
echo "Done Build"
