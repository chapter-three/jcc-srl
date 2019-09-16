## Local Development With Lando

* Docker: https://www.docker.com/community-edition
* Lando: https://docs.devwithlando.io

Once installed cd to project directory and type `lando` for a list of commands.

*Spin up the local:*

 - `lando start` - Spin up the environment.
 - `lando db-import [path to db]` - Import your database. Store db in `data/`.
 - `lando build` - Composer install `-c` will delete vendor and contribs first.
   - Or `lando composer install`
 - `lando build:theme` - Build the theme assets.
 - `lando reset` - Runs reset.sh to updb, cim, cr ...

**Ready to work.**


## Git Workflow

### Branches

 - `master` - clean stable production code. Lives on a production server.
 - `stage` - code that's ready for client review. Lives on a stage server.
 - `develop` - unstable test code for internal QA and integration testing.

### Workflow

 - Make new feature branches from the most stable branch (`feature/[ticket-id]--short-description`)
   - `master` for production sites.
   - Possibly `stage` for pre-production sites, depending on if you commit completed work to a (future production) `master` branch at the end of sprints.
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


