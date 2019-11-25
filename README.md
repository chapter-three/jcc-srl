# Judicial Council of California - Self-Represented Litigant (SRL) portal

Drupal 8.

Hosted on Pantheon.

This project assumes [Lando](https://docs.devwithlando.io) for local development but any -AMP stack will do. Use lando commands when multiple options are given.

## Initial Local Set Up.

1. Clone this repo:

   `git clone git@github.com:chapter-three/jcc-srl.git`

2. Move to root directory

   `cd jcc-srl`

3.  Start your local environment.

   `lando start` or equivalent

4.  Install dependencies with Composer.

   `lando composer install` or `composer install`

5. Import your database.

   - To get latest database from Pantheon's develop environment using [Terminus](https://pantheon.io/docs/terminus/install]) and Lando:
     ```bash

       # Go to Project root.
       cd [this-directory]

       # Create a new backup.
       terminus backup:create jcc-srl.develop --element=db

       # Get the download url
       terminus backup:get jcc-srl.develop --element=db

       # Move db to project root.
       mv [path-to-db] .

       # Import the database
       lando db-import [filename]
     ```

6. Set up local options:

   ```bash
   cd [this-directory]
   cp examples/example.drush.yml drush/drush.yml
   cp examples/example.settings.local.php web/sites/default/settings.local.php
   cp examples/example.services.local.yml web/sites/default/services.local.yml
   mkdir config-local
   mkdir sites/default/files/private
   ```

7. Test setup by logging in.

   `lando drush uli` or `drush uli`

## Git Workflow

1. Checkout latest code.

  `git checkout develop`

2. Create a feature branch.

  `git checkout -b feature/[ticket-id]--short-description`

3. Make commits.
    - All commits should begin with ticket id and specifically explain changes made. Ex: `[TW14842504] Updating README.md db import instructions and workflow notes.`

4. Rebase to origin and push feature branches.

    `git rebase origin/develop`
    `git push`

5. Create Github Pull Request(PR) against `develop` for code review.

6. CircleCI runs to deploy code, rebuild artifacts and caches, run database updates, and perform tests.

7. If CI passes, PRs should be approved and merged by another developer.

## Configuration Management

This site uses [config_split](http://drupal.org/project/config_split) and [config_exclude](http://drupal.org/project/config_exclude) to keep environment-specific and developer modules out of the repository. See [scripts/local/default/settings.local.php](scripts/local/default/settings.local.php) for example configuration.

**Typical configuration workflow:**

1. Import database locally. (See above)

2. Import configuration from code into database.

`lando drush cim` or `drush cim`

3. Make changes locally.

4. Export database configuration to code.

`lando drush cex` or `drush cex`

5. Commit and push changes.

## Git Branches and Deployments

- `master` - clean stable production code. Lives on the Pantheon "dev" environment.
  - On Pantheon `master` branch is the default "dev" environment.
  - We can deploy `master` to "Live" by tagging commits appropriately. (automated)
  - Post-launch release branches may be used to deploy to live.
  - **Do not commit directly to master**
- `stage` - code that is ready for client review. Lives on the "stage" Multidev environment.
- `develop` - Peer-reviewed test code for internal QA and integration testing. Lives on the "develop" multidev environment.

## Pantheon, Multidev and Epics

- [Terminus](https://pantheon.io/docs/terminus) is a commandline tool for interaction with Pantheon.
  - You can also use the web dashboard in place of most of these commands.

We're using a Parallel Git Workflow, rather than the standard Pantheon workflow, so we have the 3 environments described above. `develop` and `stage` are Pantheon "Multisite" environments.

- Any new branches pushed to Github will spawn a multidev on Pantheon, named for the process ID that spawned it.
- Any Pull Requests on Github will also spawn a multidev on Pantheon, named for the Pull Request ID that spawned it.
- Pantheon only allows 10 multidev environments at this service level so inactive `pr-` and `ci-` environments may need to be deleted manually.

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
  - Circle CI will build and deploy it to the new multidev environment every time it's updated.

**About Epics**

 - Features that will be part of the epic can branch from the epic so they have the up do date work they depend on.
 - Epic features can Pull Request against the epic for code review.
 - Once merged to the epic, Circle CI will build and deploy the epic to Pantheon.
 - Once the epic is complete and ready for full internal QA and integration, the epic can Pull Request to `develop`.
 - If the epic passes QA and integration the epic can be merged to `stage` for User Acceptance and signoff for release.

## Module Management

**Adding Contrib Modules**

- `lando composer require drupal/[package_name] --no-update` to add it to the composer.json without updating everything.
- `lando composer update drupal/[package_name]` to fetch/update only the desired module.

**Updating Contrib Modules**

- `lando composer update drupal/[package_name]`

**Removing Contrib Modules**

- `lando composer remove [package] --no-update` will remove a package from require or require-dev, without running all updates.
- `lando composer update [package]` will remove the package code.

**Applying patches**

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

## Sensitive config:

API keys (like SendGrid's) should be stored in the  private:// directory and managed with the key and config_split modules. Environment switches are set in settings.pantheon.php.

## Useful commands:

- Database updates:

   `lando drush updb` or `drush updb`

- Rebuild Cache:

   `lando drush cr` or `drush cr`

- Grab a login link:

   `lando drush uli` or `drush uli`

- See list of available proxy urls for local Lando development.
   `lando info`
