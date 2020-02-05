"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = undefined;

var _nameStack = require("./name-stack.js");

"use strict";

var state = {
  syntax: {},

  /**
   * Determine if the code currently being linted is strict mode code.
   *
   * @returns {boolean}
   */
  isStrict: function isStrict() {
    return this.directive["use strict"] || this.inClassBody || this.option.module || this.option.strict === "implied";
  },

  /**
   * Determine if the current state warrants a warning for statements outside
   * of strict mode code.
   *
   * While emitting warnings based on function scope would be more intuitive
   * (and less noisy), JSHint observes statement-based semantics in order to
   * preserve legacy behavior.
   *
   * This method does not take the state of the parser into account, making no
   * distinction between global code and function code. Because the "missing
   * 'use strict'" warning is *also* reported at function boundaries, this
   * function interprets `strict` option values `true` and `undefined` as
   * equivalent.
   */
  stmtMissingStrict: function stmtMissingStrict() {
    if (this.option.strict === "global") {
      return true;
    }

    if (this.option.strict === false) {
      return false;
    }

    if (this.option.globalstrict) {
      return true;
    }

    return false;
  },

  allowsGlobalUsd: function allowsGlobalUsd() {
    return this.option.strict === "global" || this.option.globalstrict || this.option.module || this.impliedClosure();
  },

  /**
   * Determine if the current configuration describes an environment that is
   * wrapped in an immediately-invoked function expression prior to evaluation.
   *
   * @returns {boolean}
   */
  impliedClosure: function impliedClosure() {
    return this.option.node || this.option.phantom || this.option.browserify;
  },

  // Assumption: chronologically ES3 < ES5 < ES6 < Moz

  inMoz: function inMoz() {
    return this.option.moz;
  },

  /**
   * Determine if constructs introduced in ECMAScript 8 should be accepted.
   *
   * @returns {boolean}
   */
  inES9: function inES9() {
    return this.esVersion >= 9;
  },

  /**
   * Determine if constructs introduced in ECMAScript 8 should be accepted.
   *
   * @returns {boolean}
   */
  inES8: function inES8() {
    return this.esVersion >= 8;
  },

  /**
   * Determine if constructs introduced in ECMAScript 7 should be accepted.
   *
   * @returns {boolean}
   */
  inES7: function inES7() {
    return this.esVersion >= 7;
  },

  /**
   * Determine if constructs introduced in ECMAScript 6 should be accepted.
   *
   * @param {boolean} strict - When `true`, do not interpret the `moz` option
   *                           as ECMAScript 6
   *
   * @returns {boolean}
   */
  inES6: function inES6(strict) {
    if (!strict && this.option.moz) {
      return true;
    }

    return this.esVersion >= 6;
  },

  /**
   * Determine if constructs introduced in ECMAScript 5 should be accepted.
   *
   * @returns {boolean}
   */
  inES5: function inES5() {
    return !this.esVersion || this.esVersion >= 5 || this.option.moz;
  },

  /**
   * Determine the current version of the input language by inspecting the
   * value of all ECMAScript-version-related options. This logic is necessary
   * to ensure compatibility with deprecated options `es3`, `es5`, and
   * `esnext`, and it may be drastically simplified when those options are
   * removed.
   *
   * @returns {string|null} - the name of any incompatible option detected,
   *                          `null` otherwise
   */
  inferEsVersion: function inferEsVersion() {
    var badOpt = null;

    if (this.option.esversion) {
      if (this.option.es3) {
        badOpt = "es3";
      } else if (this.option.es5) {
        badOpt = "es5";
      } else if (this.option.esnext) {
        badOpt = "esnext";
      }

      if (badOpt) {
        return badOpt;
      }

      if (this.option.esversion === 2015) {
        this.esVersion = 6;
      } else {
        this.esVersion = this.option.esversion;
      }
    } else if (this.option.es3) {
      this.esVersion = 3;
    } else if (this.option.esnext) {
      this.esVersion = 6;
    }

    return null;
  },

  reset: function reset() {
    this.tokens = {
      prev: null,
      next: null,
      curr: null
    };

    this.option = { unstable: {} };
    this.esVersion = 5;
    this.funct = null;
    this.ignored = {};
    this.directive = Object.create(null);
    this.jsonMode = false;
    this.lines = [];
    this.tab = "";
    this.cache = {}; // Node.JS doesn't have Map. Sniff.
    this.ignoredLines = {};
    this.forinifcheckneeded = false;
    this.nameStack = new _nameStack.NameStack();
    this.inClassBody = false;
  }
};

var exported_state = state;
exports.state = exported_state;
