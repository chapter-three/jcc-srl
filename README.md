## Local Development (lando optional)

This project contains a .lando.yml file for consistent development environments with docker.
If you choose to use a different tool for local php development you can ignore this file.

Please configure your local to use the correct php version..

### PHP: 7.3

* Docker: https://www.docker.com/community-edition
* Lando: https://docs.devwithlando.io

Once installed cd to project directory and type `lando` for a list of commands.

#### Spin up the local:

 - Clone this repo: `git clone git@github.com:chapter-three/jcc-srl.git`
 - `cd jcc-srl`
 - Start your local environment. (With lando: `lando start`)
 - `composer install` (With lando: `lando composer install`)
   - A post install script will set your settings.local.php and services.local.yml files if they do not already exist. Feel free to modify these for you local environment, they are git ignored.
   - If using Docker and or Lando (with Docker), be sure to run composer commands from inside the container to prevent PHP verson conflicts. Lando has a passthrough command: `lando composer`.
 - Import your database. (With lando: `lando db-import [path to db]`
    - Import your database.
   
      To get latest database from Pantheon's develop environment using [Terminus](https://pantheon.io/docs/terminus/install]) and Lando:
      ```bash
   
        # Go to Project root.
        cd [this-directory]
   
        # Create a new backup.
        terminus backup:create jcc-srl.develop --element=db
   
        # Get the download url
        terminus backup:get jcc-srl.develop --element=db
   
        # Move db to project root.
        mv [path-to-db] .
   
        # or import the database with Lando
        lando db-import [filename]
      ```
   
 - Build the theme:
   - See theme's README.md.
 - Run updates:
   - `cd [site directory]` - [site directory] is web for default or web/sites/[multisite].
   - Database updates: `drush updb` (With lando: `lando drush updb`)
   - Reset Cache: `drush cr` (With lando: `lando drush cr`)
   - Import config: `drush cim` (With lando: `lando drush cim`)
   - Grab a login link: `drush uli [user id] -l [local url]` default is user 1. (With lando: `lando drush uli`)
     - See `lando info` for a list of available proxy urls for local lando development.

**Ready to work.**


## Git Workflow

### Branches

 - `master` - clean stable production code. Lives on the Pantheon "dev" environment.
   - On Pantheon `master` branch is the default "dev" environment.
   - We can deploy `master` to "Live" by tagging commits appropriately. (automated)
   - **Do not commit directly to master**
 - `stage` - code that is ready for client review. Lives on the "stage" Multidev environment.
 - `develop` - Peer-reviewed test code for internal QA and integration testing. Lives on the "develop" Multidev environment.

### Pre-Launch Workflow

 - Make new feature branches from `develop` (`feature/[ticket-id]--short-description`)
 - All commits should begin with ticket id and specifically explain changes made. Ex: `[TW14842504] Updating README.md db import instructions and workflow notes.`
 - Push feature branches github and Pull Request(PR) against `develop` for code review. PRs should be approved by another developer.
 - Merge to develop for CI testing and deploy to develop environment for QA.
   - QA Pass: Pull Request / Merge feature branch to current `stage` branch for CI build/deploy to stage environment.
   - QA Fail: Check out feature branch, rebase develop, and continue working.
 
### Post-Launch Workflow
- Follow pre-launch instructions.
- User Acceptance and signoff of features on `stage`.
   - Pass: At end of the development cycle, merge all approved features to master for CI deploy to production.
     - If all features in `stage` are approved, stage branch can be merged to `master`.
     - Alternatively, merge approved features individually, or use a `release branch` to collect them and merge that to master.
   - Fail: Rebase the feature branch and repeat from develop environment.
 

### Pantheon, Multidev and Epics

Given this project will be developed on [Pantheon](https://pantheon.io), at least initially, here are some additional notes.

 - [Terminus](https://pantheon.io/docs/terminus) is a commandline tool for interaction with Pantheon.
   - You can also use the web dashboard in place of most of these commands.

We're using a Parallel Git Workflow, rather than the standard Pantheon workflow, so we have the 3 environments described above. `develop` and `stage` are Pantheon "Multisite" environments.

 - Any new branches pushed to Github will spawn a multidev on Pantheon, named for the process ID that spawned it.
 - Any Pull Requests on Github will also spawn a multidev on Pantheon, named for the Pull Request ID that spawned it.
 - These are temporary because pantheon only allows 10 multidev environments.

If you need a more persistent multidev for longer term development of a set of features, the workflow supports `epic` branches. Epics are for large features or a collection of features that depend on each other, that will be developed in parallel before being merged into the normal test environments.

The CircleCI integration is configured to deploy branches that start with `epic-` to the corresponding multidev. Set it up like this:

 - Create multidev environment on Pantheon
   - Terminus
     - terminus multidev:create [site_env] [multidev]
     - [site_env] = jcc-srl.live (The environment to clone.)
     - [multidev] = epic-[description] (Any valid Pantheon branch name prefixed with `epic-`.)
   - Web Dashboard
     - On the Multidev Tab - Multidev overview
     - Click `Create Multidev Environment`
     - Enter multidev branch name prefixed with `epic-`
     - Select the environment to clone. (dev)
 - Create an epic- branch from master in this working repo.
 - Push the epic branch to Github
   - Circle CI will build and deploy it to the new multidev environment everytime it's updated.


#### Managing multiple devs/features in the epic.

 - Features that will be part of the epic can branch from the epic so they have the up do date work they depend on.
 - Epic features can Pull Request against the epic for code review.
 - Once merged to the epic, Circle CI will build and deploy the epic to Pantheon.
 - Once the epic is complete and ready for full internal QA and integration, the epic can Pull Request to `develop`.
 - If the epic passes QA and integration the epic can be merged to `stage` for User Acceptance and signoff for release.


## Module Management

From the project root:

### Adding Contrib Modules

 - `lando composer require drupal/[package_name] --no-update` to add it to the composer.json without updating everything.
 - `lando composer update drupal/[package_name]` to fetch/update only the desired module.


### Updating Contrib Modules

 - `lando composer update drupal/[package_name]`


### Removing Contrib Modules

 - `lando composer remove [package] --no-update` will remove a package from require or require-dev, without running all updates.
 - `lando composer update [package]` will remove the package code.


### How can I apply patches to downloaded modules?

If you need to apply patches, you can do so with the
[composer-patches](https://github.com/cweagans/composer-patches) plugin.

To add a patch to drupal module foobar insert the patches section in the extra
section of composer.json:
```json
"extra": {
    "patches": {
        "drupal/foobar": {
            "Patch description": "URL to patch"
        }
    }
}
```


