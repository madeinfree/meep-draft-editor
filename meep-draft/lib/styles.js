/**
 *  @exports default
 *  @class StyleMap - Represents a map of style definations.
 */
export default class Styles {
  /**
   *  @constructor
   *  @param {Object} map - A map of style definitions.
   */
  constructor (map) {
    for(var name in map) {
      if(typeof map[name] === 'object') {
        this[name] = new Style(map[name]);
      }
    }

  }
}

/**
 * @class Style - Represent a style definination.
 */
class Style {
  /**
   * @constructor
   * @param {Object} def - The css style definition in object literal form.
   */
  constructor(def) {
    this::traverseDefinition(def);
  }
}

function traverseDefinition(def) {
  for(var prop in def) {
    if(typeof def[prop] === 'object') {
      //Any nested object should be treated as style definitions returned by
      //functions, and merged into this definition.
      this::traverseDefinition(def[prop]);
    } else {
      this[prop] = def[prop];
    }
  }
}
