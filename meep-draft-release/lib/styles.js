'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  @exports default
 *  @class StyleMap - Represents a map of style definations.
 */

var Styles =
/**
 *  @constructor
 *  @param {Object} map - A map of style definitions.
 */
function Styles(map) {
  _classCallCheck(this, Styles);

  for (var name in map) {
    if (_typeof(map[name]) === 'object') {
      this[name] = new Style(map[name]);
    }
  }
};

/**
 * @class Style - Represent a style definination.
 */


exports.default = Styles;

var Style =
/**
 * @constructor
 * @param {Object} def - The css style definition in object literal form.
 */
function Style(def) {
  _classCallCheck(this, Style);

  traverseDefinition.call(this, def);
};

function traverseDefinition(def) {
  for (var prop in def) {
    if (_typeof(def[prop]) === 'object') {
      //Any nested object should be treated as style definitions returned by
      //functions, and merged into this definition.
      traverseDefinition.call(this, def[prop]);
    } else {
      this[prop] = def[prop];
    }
  }
}