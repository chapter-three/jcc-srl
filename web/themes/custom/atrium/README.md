# Atrium

Atrium is a custom Drupal theme used for the JCC SRL project. [Laravel Mix](https://laravel-mix.com) and [Webpack](https://webpack.js.org) are used to compile and bundle SASS and JavaScript. If you need to make any changes to CSS or JavaScript, you'll need to make sure you're running the build script first.

## Installation

With [Node and NPM installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), navigate to the root of this theme in your terminal, and install NPM dependencies:

```sh
npm install
```

_Note: While the Atrium build script works properly with the current Node LTS (recommended) version, currently `10.16.3`, the Pattern Lab instance requires the current version, currently `12.12.0`. If you plan on doing development work in the Pattern Lab instance, install the current version._

## Run the Build Script

Start the build script, which will compile Sass and watch for changes:

```sh
npm run watch
```

## Proxy

Atrium's build script assumes you have setup your development environment using Lando, as documented in the main README, and uses `https://jcc.lndo.site` as the proxy for BrowserSync. If you prefer not to use Lando, and have a different virtual host, you may change the host used by the build script:

1. Copy the `.env.example` renaming to `.env` and place it in the theme root.
2. Uncomment `MIX_PROXY` and set the value to your host.

## Courtyard

The Atrium theme uses [Courtyard](https://github.com/Exygy/courtyard), a Pattern Lab instance. Courtyard is installed via Composer as a [Drupal Library](https://www.drupal.org/docs/8/theming/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme) to `web/libraries/courtyard`. Source Twig templates and compiled assets from Courtyard are directly consumed by Drupal. This is done by:

- using the [Components](https://www.drupal.org/project/components) module to register namespaces to the Pattern Lab's templates.
- a library definition, which references Courtyard's global CSS and JavaScript files.

See `atrium.info.yml` and `atrium.libraries.yml` for details.

### ⚠️ Important Development Notes ⚠️

_Installation is NOT required unless you need to do development work in Pattern Lab._

When Composer `install` or `update` commands are run in the root of this repository, all `.git` directories are deleted. This is required because Pantheon doesn't support Git submodules, and has important implications for the Courtyard development workflow in the context of the Drupal repository:

1. The Courtyard repository needs to be cloned manually, after updating the Drupal environment:

    ```sh
    cd web/libraries
    rm -rf courtyard
    git clone git@github.com:Exygy/courtyard.git
    ```

2. You'll need to be **very careful** to commit and push all outstanding Courtyard development work to Github work BEFORE running any Composer `install` or `update` commands in the root of this repository. Failure to do so will result in lost work.

3. When this occurs, you'll need to reinstall Courtyard's Composer and NPM dependencies described below.

### Courtyard Installation

1. Navigate to the Courtyard source: `cd web/libraries/courtyard`
2. Install Composer dependencies: `composer install` and complete the wizard:

    | Question | Answer |
    | :------- | :----: |
    | _the path `./source/_twig-components/functions` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_ | `M` |
    | _the path `./source/_twig-components/filters` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_ | `M` |
    | _the path `./source/_twig-components/tags` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_ | `M` |
    | _update the config option `twigDebug (1)` with the value ? Y/n_ | `N` |
    | _update the config option `twigAutoescape ()` with the value html?_ Y/n | `N` |
    | _the path `./public/` already exists. merge or replace with the contents of `pattern-lab/styleguidekit-assets-default` package? M/r_ | `R` |
    | _update the config option styleguideKitPath (`...web/libraries/courtyard/vendor/pattern-lab/styleguidekit-twig-default`) with the value `vendor/pattern-lab/styleguidekit-twig-default`? Y/n_ | `Y` |

3. Install Node Dependencies: `npm install`

### Run the Courtyard Build Script

Start the build script from the `web/libraries/courtyard` directory, to generate the pattern library, watch for changes, and serve the pattern library on localhost at a port that will be specified in the command's console output:

```sh
npm run start
```

## Updating Courtyard within Drupal

Once Courtyard becomes stable, and has official releases, this process will change to require a given release. Until then, we are using commit hashes:

1. Obtain the latest commit hash. This can be found on the [commits](https://github.com/Exygy/courtyard/commits/master) page, or by running the following command: `git ls-remote https://github.com/Exygy/courtyard.git HEAD | awk '{ print substr($1,1,7)}'`
2. From the repository root, require the package with the hash, for example: `composer require exygy/courtyard:dev-master#0bfadb6`
3. Update the lock file: `composer update --lock`
