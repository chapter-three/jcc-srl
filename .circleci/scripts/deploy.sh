#!/bin/bash

TIMESTAMP=$(date +'%y-%m-%dT%H:%m:%S')

git config --global user.email "$GIT_EMAIL"
git config --global user.name "Ch3-P0"

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
git push origin $CIRCLE_BRANCH -f --tags
echo "If deployment was successful, post-code-update hook will handle importing config, updating db, and clearing caches."
