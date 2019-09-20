#!/bin/bash

TIMESTAMP=$(date +'%y-%m-%dT%H:%m:%S')

git config --global user.email "$GIT_EMAIL"
git config --global user.name "Ch3-P0"
# Add fingerprint to known hosts so ssh connects.
echo "[codeserver.dev.abf80fcd-ec2c-458e-af3b-ef411f512a20.drush.in]:2222 ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDSY3gnr0DrbqJJSnEFy6jazDmAdBm4Zs/EkWIQa7x31qgSYyYJMz5V+pk62lBf2BN42VtubwO83vW9G+yG2K1RGOvZJaK5GBvBb/Ws2ZPcp/4sNHpPzkdd75e5/Pk8AWA59XUbJcBWmrDrHMbWV1j2zqPPikxbqGeTTjSx4QR18LIRei5OwT6VQnaVnJqPAqFZ+oCbpr0DL96foL3UEY8EWT/6GH2cANEGZO4ppbhdDw4uG6TaI7S0lxWMQEVy+iwjCNH/nanjd73cwoYd90E0OVdgNDr3hVbIuE6sUW6UwlaAwuyOM/xJYPg1y0rF66958pyVJlZ9KD5A0kY3bHg7" >> ~/.ssh/known_hosts

echo "\nClone artifact.\n"
mkdir -p data
cd data
git clone $TERMINUS_GIT artifact
echo "\nCheckout $CIRCLE_BRANCH\n"
cd artifact
git fetch origin && git checkout $CIRCLE_BRANCH
git pull origin $CIRCLE_BRANCH
echo "\nSync to artifact.\n"
cd ../.. && composer -n artifact-sync
cd data/artifact
git add .
git commit -am "Built assets. $TIMESTAMP"
echo "\n@todo- Work out release taging.\n"

# Tag for dev.
# Pantheon's serial workflow uses a tag on master to set "Test" environment.
# Try tagging develop branch with pantheon_dev_N to see if we can hijack.
if [ $CIRCLE_BRANCH == 'develop' ] ; then
  # Get latest pantheon_dev_ tag.
  git fetch origin --tags
  pantheon_prefix='pantheon_dev_'
  pantheon_current=$(git tag -l --sort=v:refname $pantheon_prefix* | tail -1)
  if [ -z $pantheon_current ] ; then
    # No current tag so start with 1.
    pantheon_new=1
  else
    pantheon_id=${pantheon_current#${pantheon_prefix}}
    pantheon_new=$(($pantheon_id+1))
  fi
  echo
  echo "Tagging develop branch for dev environment: $pantheon_prefix$pantheon_new"
  git tag -a $pantheon_prefix$pantheon_new -m "Tagging new pantheon dev release."
fi

# Tag for test/stage.
# Pantheon's serial workflow uses a tag on master to set "Test" environment.
# Try tagging stage branch with pahtheon_test_N to see if we can hijack.
if [ $CIRCLE_BRANCH == 'stage' ] ; then
  # Get latest pantheon_live_ tag.
  git fetch origin --tags
  pantheon_prefix='pantheon_test_'
  pantheon_current=$(git tag -l --sort=v:refname $pantheon_prefix* | tail -1)
  if [ -z $pantheon_current ] ; then
    # No current tag so start with 1.
    pantheon_new=1
  else
    pantheon_id=${pantheon_current#${pantheon_prefix}}
    pantheon_new=$(($pantheon_id+1))
  fi
  echo
  echo "Tagging stage branch for test environment: $pantheon_prefix$pantheon_new"
  git tag -a $pantheon_prefix$pantheon_new -m "Tagging new pantheon test release."
fi

# Tag for master.
if [ $CIRCLE_BRANCH == 'master' ] ; then
  # Get latest pantheon_live_ tag.
  git fetch origin --tags
  pantheon_prefix='pantheon_live_'
  pantheon_current=$(git tag -l --sort=v:refname $pantheon_prefix* | tail -1)
  if [ -z $pantheon_current ] ; then
    # No current tag so start with 1.
    pantheon_new=1
  else
    pantheon_id=${pantheon_current#${pantheon_prefix}}
    pantheon_new=$(($pantheon_id+1))
  fi
  echo
  echo "Tagging master branch for production (Live): $pantheon_prefix$pantheon_new"
  git tag -a $pantheon_prefix$pantheon_new -m "Tagging new pantheon live release."
fi

echo
echo "Pushing $CIRCLE_BRANCH"
git push origin $CIRCLE_BRANCH -f --tags

echo
echo "If deployment was successful, post-code-update hook will handle importing config, updating db, and clearing caches."

