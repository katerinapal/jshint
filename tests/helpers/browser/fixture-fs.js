"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var resolve = _path2.default.resolve;

exports.readFileSync = function (path) {
  return window.JSHintTestFixtures[resolve(path)];
};
