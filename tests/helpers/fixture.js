'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixture = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jshint node:true */

'use strict';

var fixture = function fixture(name) {
  return _fs2.default.readFileSync(__dirname + '/../unit/fixtures/' + name).toString();
};

exports.fixture = fixture;
;
