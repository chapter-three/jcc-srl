# Atrium

- [About](#about)
- [Installation](#installation)
- [Updating Courtyard Within Drual](#updating-courtyard-within-drupal)

## About

Requirements:

  - Node 12 - there's an `.nvmrc` file.

Atrium is a custom Drupal theme developed for the JCC SRL project, which uses [Courtyard](https://github.com/judicialcouncilofcalifornia/courtyard), a Pattern Lab instance.

- Courtyard is installed via Composer as a [Drupal Library](https://www.drupal.org/docs/8/theming/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme) to `web/libraries/courtyard-artifact`. See documentation for [updating](#updating-courtyard-within-drupal) as needed.
- Source Twig templates are directly consumed by Drupal, with the help of [Components](https://www.drupal.org/project/components) module, and namespaces common to Courtyard and Atrium. See `component-libraries` in `atrium.info.yml`.
- Courtyard's compiled assets are also directly consumed by Drupal, via a library definition in `atrium.libraries.yml`, which is loaded globally.
- Atrium uses [Laravel Mix](https://laravel-mix.com) and [Webpack](https://webpack.js.org) to compile and bundle SASS and JavaScript. For more information on how to work with Sass and JavaScript in this theme, see the following documentation:

  - Sass: [`src/sass/README.md`](./src/sass/README.md)
  - JavaScript: [`src/js/README.md`](./src/js/README.md)

- Atrium's build includes Courtyard Sass variables, mixins, and [USWDS](https://github.com/uswds/uswds) dependencies in `src/sass/base/_base.scss`.

## Atrium Installation

1. Ensure that Courtyard has been installed (see instructions above).

2. Navigate to the Atrium source: `cd web/themes/custom/atrium`

3. Install NPM dependencies: `npm install`

4. Start the build script, which will compile Sass and watch for changes: `npm run start`

#### Customizing the BrowserSync Proxy

Atrium's build script assumes you have setup your development environment using Lando, as documented in the main README, and uses `https://jcc.lndo.site` as the proxy for BrowserSync. If you prefer not to use Lando, and have a different virtual host, you may change the host used by the build script:

1. Copy the `.env.example` renaming to `.env` and place it in the theme root.
2. Uncomment `MIX_PROXY` and set the value to your host.
