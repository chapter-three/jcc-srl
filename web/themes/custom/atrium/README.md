# Atrium

Atrium is a custom Drupal theme used for the JCC SRL project. This theme uses [Laravel Mix](https://laravel-mix.com) and [Webpack](https://webpack.js.org) to compile and bundle SASS and JavaScript. If you need to make any changes to CSS or JavaScript, you'll need to make sure you're running the build script first.

## Installation

With [Node and NPM installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), navigate to the root of this theme in your terminal, and install NPM dependencies:

```sh
npm install
```

## Run the Build Script

Start the build script, which will compile Sass and watch for changes:

```sh
npm run watch
```

## Proxy

This build script assumes you have setup your development environment using Lando, as documented in the main README, and uses `https://jcc.lndo.site` as the proxy for BrowserSync. If you prefer not to use Lando, and have a different virtual host, you may change the host used by the build script:

1. Copy the `.env.example` renaming to `.env` and place it in the theme root.
2. Uncomment the `MIX_PROXY` and set the value to your host.
