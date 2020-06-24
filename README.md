# Judicial Council of California - Self-Represented Litigant (SRL) portal

Drupal 8. Hosted on Pantheon.

This project assumes [Lando](https://docs.devwithlando.io) for local development but any -AMP stack will do. Use lando commands when multiple options are given.

## Initial Local Set Up

1. Clone this repo:

   `git clone git@github.com:chapter-three/jcc-srl.git`

2. Move to root directory

   `cd jcc-srl`

3.  Start your local environment.

   `lando start` or equivalent

4.  Install dependencies with Composer.

   `lando composer install` or `composer install`

5. Import your database.

   To get latest database from Pantheon's develop environment using [Terminus](https://pantheon.io/docs/terminus/install]) and Lando:

   ```bash
     # Go to Project root.
     cd [this-directory]
     
     # Set environment variable
     env=develop # or env=epic-alpha2

     # Remove existing file.
     rm database.$env.sql.gz

     # Create a new backup.
     terminus backup:create jcc-srl.$env --element=db

     # Get the download url
     terminus backup:get jcc-srl.$env --element=db --to=database.$env.sql.gz
     # Import the database
     lando db-import database.$env.sql.gz
   ```

6. Set up local options:

   ```bash
   cd [this-directory]
   cp examples/example.drush.yml drush/drush.yml
   cp examples/example.settings.local.php web/sites/default/settings.local.php
   cp examples/example.services.local.yml web/sites/default/services.local.yml
   mkdir config/config-local
   mkdir web/sites/default/files/private
   mkdir web/sites/default/files/tmp
   ```

7. Test setup by logging in.

   `lando drush uli` or `drush uli`

## Git Workflow

1. Checkout latest code.

  `git checkout develop`

2. Create a feature branch.

  `git checkout -b feature/[ticket-id]--short-description`

3. Make commits.

   All commits should begin with ticket id and specifically explain changes made. Ex: `[TW14842504] Updating README.md db import instructions and workflow notes.`

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

## Environments

### `live` environment 🚨
- Tracks the `master` branch.
- Production!
- Content authoring happens here. 

### `stage` environment
- Tracks the `master` branch.
- Production-ready code. 
- JCC content team can use this environment for content testing

### `dev` environment
- Tracks the `master` branch.
- Production-ready code. 
- Use this environment to stage deployments to live.

### `develop` environment 
- Tracks the `develop` branch. 
- Most code will go here after a PR.

### Other Environments
- Circle CI can be used to spawn Pantheon multidevs as needed for various QA purposes. 
- Any new code pushed to Github will spawn a multidev on Pantheon, named for the process ID that spawned it.
- Any Pull Requests on Github will also spawn a multidev on Pantheon, named for the Pull Request ID that spawned it.
- Pantheon only allows 10 multidev environments at this service level so inactive `pr-` and `ci-` environments may need to be deleted manually.
- If you need a more persistent multidev for longer term development, the CircleCI integration is configured to deploy branches that start with `epic-` to the corresponding multidev.  
  
## Deployments
See [Deployment Notes](https://github.com/chapter-three/jcc-srl/wiki/Deployment-Notes) in wiki. 

### Deploy to Persistent Multidev (epic) on Pantheon
1. Create multidev environment with Terminus or through the Pantheon dashboard.
    
    `terminus multidev:create jcc-srl.[env-to-clone] epic-[feature]`
    [site_env] = jcc-srl.live (The environment to clone.)

2. Create `epic-[feature]` branch from `master` in git.

    ```bash
    git checkout -b epic-[feature]
    git push
    ```

Circle CI will build and deploy code to the new multidev environment every time the epic's branch updated. The database will not be synced/wiped automatically.

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

- Remote drush:
   `lando drush @jcc-srl.[env] [command]`
