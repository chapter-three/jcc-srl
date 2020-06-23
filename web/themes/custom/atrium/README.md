# Atrium

- [About](#about)
- [Installation](#installation)
- [Updating Courtyard Within Drual](#updating-courtyard-within-drupal)

## About

Atrium is a custom Drupal theme developed for the JCC SRL project, which uses [Courtyard](https://github.com/judicialcouncilofcalifornia/courtyard), a Pattern Lab instance.

- Courtyard is installed via Composer as a [Drupal Library](https://www.drupal.org/docs/8/theming/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme) to `web/libraries/courtyard`. See documentation for [updating](#updating-courtyard-within-drupal) as needed.
- Source Twig templates are directly consumed by Drupal, with the help of [Components](https://www.drupal.org/project/components) module, and namespaces common to Courtyard and Atrium. See `component-libraries` in `atrium.info.yml`.
- Courtyard's compiled assets are also directly consumed by Drupal, via a library definition in `atrium.libraries.yml`, which is loaded globally.
- Atrium uses [Laravel Mix](https://laravel-mix.com) and [Webpack](https://webpack.js.org) to compile and bundle SASS and JavaScript. For more information on how to work with Sass and JavaScript in this theme, see the following documentation:

  - Sass: [`src/sass/README.md`](./src/sass/README.md)
  - JavaScript: [`src/js/README.md`](./src/js/README.md)

- Atrium's build includes Courtyard Sass variables, mixins, and [USWDS](https://github.com/uswds/uswds) dependencies in `src/sass/base/_base.scss`.

## Installation

### 1. Prerequisites

Ensure that [Node\* and NPM are installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) before proceeding.

_Note: While the Atrium build script works properly with the current Node LTS (recommended) version, currently `12.13.0`, the Pattern Lab instance requires the current version, currently `13.1.0`._

### 2. Courtyard Installation

1. Navigate to the Courtyard source: `cd web/libraries/courtyard`.

2. Install NPM Dependencies: `npm install`.

3. Install Composer dependencies: `composer install` and complete the wizard:

   | Question                                                                                                                                                                                      | Answer |
   | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
   | _the path `./source/_twig-components/functions` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_                                        |  `M`   |
   | _the path `./source/_twig-components/filters` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_                                          |  `M`   |
   | _the path `./source/_twig-components/tags` already exists. merge or replace with the contents of pattern-lab/drupal-twig-components package? M/r_                                             |  `M`   |
   | _update the config option `twigDebug (1)` with the value ? Y/n_                                                                                                                               |  `N`   |
   | _update the config option `twigAutoescape ()` with the value html?_ Y/n                                                                                                                       |  `N`   |
   | _the path `./public/` already exists. merge or replace with the contents of `pattern-lab/styleguidekit-assets-default` package? M/r_                                                          |  `M`   |
   | _update the config option styleguideKitPath (`...web/libraries/courtyard/vendor/pattern-lab/styleguidekit-twig-default`) with the value `vendor/pattern-lab/styleguidekit-twig-default`? Y/n_ |  `Y`   |

4. Start the build script from the `web/libraries/courtyard` directory: `npm run start`

---

#### ⚠️ Important Courtyard Development Notes ⚠️

When Composer `install` or `update` commands are run in the root of this repository, the entire courtyard directory is removed, including all `.git`, `node_modules`, `vendor` directory. This is required because Pantheon doesn't support Git submodules, and has important implications for the Courtyard development workflow in the context of the Drupal repository.

You'll need to be **very careful** to commit and push all outstanding Courtyard development work to Github work BEFORE running any Composer `install` or `update` commands in the root of this repository. Failure to do so will result in lost work.

1. The Courtyard repository needs to be cloned manually, and reinstalled (see instructions below), after updating the Drupal environment.

   ```sh
   cd web/libraries
   rm -rf courtyard
   git clone git@github.com:judicialcouncilofcalifornia/courtyard.git
   ```

2. Reinstall Courtyard's Composer and NPM dependencies described above.

### 3. Atrium Installation

1. Ensure that Courtyard has been installed (see instructions above).

2. Navigate to the Atrium source: `cd web/themes/custom/atrium`

3. Install NPM dependencies: `npm install`

4. Start the build script, which will compile Sass and watch for changes: `npm run start`

#### Customizing the BrowserSync Proxy

Atrium's build script assumes you have setup your development environment using Lando, as documented in the main README, and uses `https://jcc.lndo.site` as the proxy for BrowserSync. If you prefer not to use Lando, and have a different virtual host, you may change the host used by the build script:

1. Copy the `.env.example` renaming to `.env` and place it in the theme root.
2. Uncomment `MIX_PROXY` and set the value to your host.

## Updating Courtyard within Drupal

Once Courtyard becomes stable, and has official releases, this process will change to require a given release. Until then, we are using commit hashes:

1. Obtain the latest commit hash. This can be found on the [commits](https://github.com/JudicialCouncilOfCalifornia/courtyard/commits/master) page, or by running the following command: `git ls-remote https://github.com/judicialcouncilofcalifornia/courtyard.git HEAD | awk '{ print substr($1,1,7)}'`
2. From the repository root, require the package with the hash, for example: `lando composer require judicialcouncilofcalifornia/courtyard:dev-master#0bfadb6`
3. Update the lock file: `lando composer update --lock`

4. Quick commands:
  ```bash
  # Set target branch with `branch=[branch]`
  branch=development 
  
  # Get hash
  hash=$(git ls-remote  https://github.com/judicialcouncilofcalifornia/courtyard.git $branch | awk '{ print substr($1,1,7)}')
  
  # Add to composer
  lando composer require judicialcouncilofcalifornia/courtyard:dev-$branch#$hash
  
  # Update lock file.
  lando composer update --lock
  
  ```
