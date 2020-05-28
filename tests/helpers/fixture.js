import ext_fs_fs from "fs";
/*jshint node:true */

'use strict';

fixture_fixture = function (name) {
  return ext_fs_fs.readFileSync(__dirname + '/../unit/fixtures/' + name).toString();
};
var fixture_fixture;
export { fixture_fixture as fixture };
