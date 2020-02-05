import fs from "fs";
/*jshint node:true */

'use strict';

var fixture = function (name) {
  return fs.readFileSync(__dirname + '/../unit/fixtures/' + name).toString();
};

export { fixture };;
