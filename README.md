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
   - See `scripts/local/default/sql.start` for an dump from initial install.
   - This is a SQL file but .sql is git ignored so it's named sql.start. Import it directly if you need a starter with the correct config ids.
   - If a more recent database dump is available, use that instead.
 - Build the theme:
   - `cd web/sites/custom/atrium`
   - `npm install` (With lando: `lando npm install`)
   - If using Docker/Lando, be sure to run npm from inside the container to prevent version conflicts.
   - `npm run dev` to build assets. (With lando: `lando npm run dev`)
   - **Optional for theme work:** run the watcher with `npm run watch`.
     - See `web/sites/custom/atrium/webpack.mix.js` for proxy url.
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

 - `master` - clean stable production code. Lives on a production server.
 - `stage` - code that's ready for client review. Lives on a stage server.
 - `develop` - unstable test code for internal QA and integration testing.

### Workflow

 - Make new feature branches from the most stable branch (`feature/[ticket-id]--short-description`)
   - From `master` for production sites.
   - Possibly from `stage` for pre-production sites, depending on if you commit completed work to a (future production) `master` branch at the end of sprints.
 - Push feature branches github and Pull Request against `develop` for code review.
 - Merge to develop for CI testing and deploy to develop environment for QA.
   - QA Pass: Pull Request / Merge feature branch to current `stage` branch for CI build/deploy to stage environment.
   - QA Fail: Keep working on feature branch and repeat.
 - Client review of features on `stage`.
   - Client review Pass: At end of the sprint merge all client approved features to master for CI deploy to production.
     - If all features in `stage` are approved, stage branch can be merged to `master` IF you're sure it's clean.
     - Otherwise, merge approved features individually, or use a `release branch` to collect them and merge that to master.
 - Repeat for next sprint.


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


