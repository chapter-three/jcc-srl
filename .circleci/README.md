# CircleCI Configuration Notes

This project currently uses a workflow that relies heavily on Pantheon features including Terminus and Multidev. It also has a more platform agnostic example built in.

The implementation of CI/CD workflow when you move to Azure will depend on choices you make for developer workflow, test environments and technology. Azure Cloud has it's own Pipelines you may choose instead of CircleCI.

Each CI platform has thorough documentation, but I'll describe the general concepts currently employed on this project.

## General Concepts

A CircleCI pipeline is configured via `config.yml` in the `.circleci` directory of this project.

It configures a docker image that is representative of the environement we'll deploy to. In this case `quay.io/pantheon-public/build-tools-ci:6.x`. You'll want to update this if you move to a different host configuration.

It sets some variables used later in the steps.

It defines jobs consisting of steps. Steps are keyed with commands `run`, `save_cache`, `restore_cache`, etc.

 * `run`: can define a command which executes like the commandline inside the build container. Often this simply calls scripts included in the `.circleci` directory, to do the heavy lifting.
 * `save_cach`: define a key and a path to make accessible later in a workflow so you can avoid having to generate their contents again in the same workflow, to save some time. (i.e. `$HOME/.composer/cache`)
 * `restore_cache`: loads the caches saved previously in the workflow.

It defines a workflow `build_and_test` that runs the jobs defined previously, with conditions (on which branches) and requirements (deploying code requires a succesful build first).

### Configuring Github and Host

For the containers used by CircleCI to access git repos and execute commands on your Github repo and Hosting platform, you need to configure some environment variables in the CircleCI UI for your project. This keeps sensitive information out of the repo.

For access to Drupal, Github and Pantheon, these are currently:
```
ADMIN_EMAIL
ADMIN_PASSWORD
GITHUB_TOKEN
GIT_EMAIL
TERMINUS_GIT
TERMINUS_SITE
TERMINUS_TOKEN
```

## Pantheon in Brief

* Terminus: A Pantheon commandline tool is used to interact with the pantheon account to create Multidev environments and run drush commands.
* Multidev: (DO NOT confuse with Drupal "multisite") is what Pantheon calls extra test environments based on additional git test branches.

On the creation of a Pull Request (PR) on Github, CircleCI will build the codebase from the feature branch, running composer install. When CircleCI is triggered, is configured in the settings for your project on Github.

If the build completes it will create a new Pantheon Multidev environment cloning the active test database for content from `develop` branch.

* The multidev environment is named after the PR id.  `pr-42`
* You need to manually delete these multidev environments after the PR is merged to `develop` as there is a limit of 10.
* See repo README.md for additional information on workflow.

## A More Platform Agnostic Approach

My preference is to design a pipeline that limits dependency on anything other than fundamental tools.

For a Symfony application like Drupal we want a docker image that matches our production environment for build and automated testing. We want to include git and composer.

The workflow/pipeline could consist of 3 jobs, `build`, `test`, and `deploy`.

`build` will spin up the environment and run `composer install` to build Drupal and compile your theme if necessary. This should all be automated in the `composer.json` file.

If the `build` job passes, `test` will run any commands/scripts for code linting and automated testing.

If `test` passes, it will notify Github that the PR is ok to merge.

These jobs will also run when an environment branch is updated by the merge of a PR or if someone manually pushes changes to the environment branch.  Environment branches may include `develop`, `stage`, and `master`, or perhaps only one, depending on your git branching strategy and workflow.

When the pipeline runs on an environment branch, the `deploy` job can run if the `build` and `test` jobs pass.

## Deploying an Artifact

When deploying a build we do not want to deploy everything in the working Github repo to the environment. We only want to deploy the parts of the repo that make the working application.

A simple process for doing this is defined in the `.circleci/scripts/deploy.sh` file. This is currently written in BASH, but could easily be converted to PHP for more familiarity to PHP developers, or even JS if this were a Node project.

Rather than depending on tooling specific to a hosting platform like Pantheon/Terminus to do the work, we can use basic tools available to any linux container. In this case git and rsync.

At this point in the build pipeline we already have our test build. All the deploy script needs to do is:

 * `git clone` the git repo from the environment (the artifact)
 * `git checkout` the correct environment branch in the artifact.
 * `rsync` the correct files from our working repo (on the matching environment branch) to the artifact.
 * `git add` and `git commit` the changes.
 * `git push` the artifact to the environment.

That's essentially it. This could be done with platform integrated tooling like `terminus` or even via commands in the CircleCI `config.yml`, but if we script it manually, moving the project somewhere else is simple. Even retooling the CI config is just a matter of telling the new CI platform to run the scripts we already have.

You could even deploy the project from your local with one command.

### Post Deploy

Depending on your hosting platform, certain things may need to occur in order to deploy your new code to an environment. For example, code doesn't run directly from the git repository on the host. Code syncs to a `work_tree`.

In the case of Pantheon, code is deployed to multidev environments based on branch name and standard environments based on tags.

On Acquia you can set whether an environment syncs code from a branch or a tag.

If you're running your own servers you can achieve code sync to a `work_tree` with a `post-recieve` git hook.

After deploying a Drupal project, we usually want to run database updates, config import and cache reset. There is more than one approach you can take with this.

If your project has drush aliases configured for your hosting platform, you can add the drush commands to the deploy script or CI config file for:

 * `drush @[site.env] updb -y` Database Updates
 * `drush @[site.env] cim -y` Config Import
 * `drush @[site.env] cr` Cache Reset

### The Current Pantheon Post Deploy

For early development with Multidev environments, the drush commands are run by terminus and code syncing is done based on the branch name.

The repo is also configured for "parallel testing environments" when we have a version live on production. In this case, `develop` and `stage` are Multidev environments and code is synced based on branch name. `master` is the production branch and new releases will be synced to the Live environment with a `pantheon_live_N` tag.

On these three branches, the drush commands are run by "Quicksilver", the equivalant to git hooks on Pantheon.

**NOTE**: it's probably better to use Drush aliases in this case, as they are available and not Pantheon specific. Quicksilver was used for legacy reasons. In any case, moving to a new host will require generating new Drush aliases.

## Closing

As you can see, configuring your CI/CD pipeline can depend on a number of factors and preferences. The current configuration may change during it's life on Pantheon, in order to better serve the evolving needs of the project.

When you ultimately move to Azure, or another platform, you'll need to plan it out.

