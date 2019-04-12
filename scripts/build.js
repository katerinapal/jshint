"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target, done) {
  var bundle = (0, _browserify2.default)();

  done = done || function () {};

  if (targets.indexOf(target) === -1) {
    done(new Error("Unrecognized target: '" + target + "'"));
    return;
  }

  bundle.require(srcDir + "/jshint.js", { expose: "jshint" });

  return bundle.bundle(function (err, src) {
    var wrapped;

    if (err) {
      done(err);
      return;
    }

    wrapped = ["/*! " + version + " */", "var JSHINT;", "if (typeof window === 'undefined') window = {};", "(function () {", "var require;", src, "JSHINT = require('jshint').JSHINT;", "if (typeof exports === 'object' && exports) exports.JSHINT = JSHINT;", "}());"];

    if (target === "rhino") {
      wrapped.splice(0, 0, "#!/usr/bin/env rhino", "var window = {};");
    }

    done(null, version, wrapped.join("\n"));
  });
};

var _browserify = require("browserify");

var _browserify2 = _interopRequireDefault(_browserify);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var version = require("../package.json").version;

var srcDir = _path2.default.join(__dirname, "../src");

var targets = ["web", "rhino"];

;;
module.exports = exports.default;
