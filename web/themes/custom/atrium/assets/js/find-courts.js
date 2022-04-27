/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/find-courts.js":
/*!*******************************!*\
  !*** ./src/js/find-courts.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function ($, Drupal) {
  'use strict';
  /**
   * Clear the id/nid form element (since it's hidden) so the search
   * only uses what the user typed.
   */

  Drupal.behaviors.findCourts = {
    attach: function attach(context) {
      $('.view').each(function (i, view) {
        var $view = $(view);

        if ($view.hasClass('view-find-courts')) {
          $view.find('.form-item-s input').on('keydown', function () {
            $view.find('.form-item-id input').val('');
          });
          $view.find('input.form-submit').on('mousedown', function (event) {
            $view.find('.form-item-id input').val('');
          });
        }
      });
    }
  };
  /**
   * When there are multiple `court` results from a search, the user
   * will need to pick one of the results (called $court_links below).
   * Update the search's exposed form with the link's data. This is for
   * ajax enabled views only.
   *
   * See views-view--find-courts--self-help-block.html.twig for more
   */

  Drupal.behaviors.selfHelpMiniBlock = {
    attach: function attach(context) {
      $.each(Drupal.views.instances, function (i, view) {
        if (view.settings.view_name == 'find_courts' && view.settings.view_display_id == 'self_help_block') {
          var $view = $(view.element_settings.selector);
          var $court_links = $view.find('.court-links a');
          $court_links.on('click', function (event) {
            event.preventDefault();
            var nid = $(this).attr('data-nid');
            $view.find('input[name=id]').val(nid);
            $view.find('input[type=submit]').click();
          });
        }
      });
    }
  };
})(jQuery, Drupal);

/***/ }),

/***/ 5:
/*!*************************************!*\
  !*** multi ./src/js/find-courts.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/baptisteniviere/projects/JCC/SRL/jcc-srl/web/themes/custom/atrium/src/js/find-courts.js */"./src/js/find-courts.js");


/***/ })

/******/ });