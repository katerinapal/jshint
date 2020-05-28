import ext_path_path from "path";
"use strict";

var resolve = ext_path_path.resolve;

var readFileSync;

readFileSync = function(path) {
  return window.JSHintTestFixtures[resolve(path)];
};
