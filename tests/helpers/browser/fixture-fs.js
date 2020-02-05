import path_moduleObject from "path";
"use strict";

var resolve = path_moduleObject.resolve;

exports.readFileSync = function(path) {
  return window.JSHintTestFixtures[resolve(path)];
};
