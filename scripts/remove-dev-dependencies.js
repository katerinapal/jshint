"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";
var manifestLocation = _path2.default.join(__dirname, "..", "package.json");
var manifest = require(manifestLocation);
var packageNames = process.argv.slice(2);
var newContents;

packageNames.forEach(function (packageName) {
  if (!manifest.devDependencies[packageName]) {
    throw new Error("Could not locate development dependency named \"" + packageName + "\"");
  }

  delete manifest.devDependencies[packageName];
});

newContents = JSON.stringify(manifest, null, 2);

_fs2.default.writeFile(manifestLocation, newContents, function (err) {
  if (err) {
    throw new Error(err);
  }

  console.log("Successfully removed packages. New contents:");
  console.log(newContents.replace(/(^|\n)/g, "$1> "));
});
