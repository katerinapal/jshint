import ext_browserify_browserify from "browserify";
import ext_path_path from "path";
"use strict";

var version    = null;

var srcDir     = ext_path_path.join(__dirname, "../src");

var targets = ["web", "rhino"];

var encapsulated_anonymus;

encapsulated_anonymus = function(target, done) {
  var bundle = ext_browserify_browserify();

  done = done || function() {};

  if (targets.indexOf(target) === -1) {
    done(new Error("Unrecognized target: '" + target + "'"));
    return;
  }

  bundle.require(srcDir + "/jshint.js", { expose: "jshint" });

  return bundle.bundle(function(err, src) {
    var wrapped;

    if (err) {
      done(err);
      return;
    }

    wrapped = [ "/*! " + version + " */",
      "var JSHINT;",
      "if (typeof window === 'undefined') window = {};",
      "(function () {",
        "var require;",
        src,
        "JSHINT = require('jshint').JSHINT;",
        "if (typeof exports === 'object' && exports) exports.JSHINT = JSHINT;",
      "}());"
    ];

    if (target === "rhino") {
      wrapped.splice(0, 0, "#!/usr/bin/env rhino", "var window = {};");
    }

    done(null, version, wrapped.join("\n"));
  });
};
