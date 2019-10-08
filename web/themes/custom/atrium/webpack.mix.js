/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your application. See https://github.com/JeffreyWay/laravel-mix.
 |
 */
const proxy = process.env.MIX_PROXY ? process.env.MIX_PROXY : "https://jcc.lndo.site";
const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Configuration
 |--------------------------------------------------------------------------
 */
mix.setPublicPath("assets").disableNotifications();

/*
 |--------------------------------------------------------------------------
 | Browsersync
 |--------------------------------------------------------------------------
 */
mix.browserSync({
  proxy: proxy,
  files: ["assets/js/**/*.js", "assets/css/**/*.css"],
  stream: true,
  watch: true
});

/*
 |--------------------------------------------------------------------------
 | SASS
 |--------------------------------------------------------------------------
 */
mix
  .sass("src/sass/atrium.style.scss", "css", {
    includePaths: ["node_modules", "../../../libraries"]
  })
  .options({
    processCssUrls: false,
    autoprefixer: {
      enabled: true,
      options: {
        grid: true,
        overrideBrowserslist: ["last 2 versions", ">= 1%", "ie >= 11"]
      }
    }
  });

/*
 |--------------------------------------------------------------------------
 | JS
 |--------------------------------------------------------------------------
 */
mix.js("src/js/atrium.script.js", "js");
