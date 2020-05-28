import ext_path_path from "path";
import ext_fs_fs from "fs";
"use strict"
var manifestLocation = ext_path_path.join(__dirname, "..", "package.json");
var manifest = require(manifestLocation);
var packageNames = process.argv.slice(2);
var newContents;

packageNames.forEach(function(packageName) {
  if (!manifest.devDependencies[packageName]) {
    throw new Error("Could not locate development dependency named \"" + packageName + "\"");
  }

  delete manifest.devDependencies[packageName];
});

newContents = JSON.stringify(manifest, null, 2);

ext_fs_fs.writeFile(manifestLocation, newContents, function(err) {
  if (err) {
    throw new Error(err);
  }

  console.log("Successfully removed packages. New contents:");
  console.log(newContents.replace(/(^|\n)/g, "$1> "));
});
