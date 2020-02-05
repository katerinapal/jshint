"use strict";

var _phantom = require("phantom");

var _phantom2 = _interopRequireDefault(_phantom);

var _phantomjsPrebuilt = require("phantomjs-prebuilt");

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

var _server = require("./helpers/browser/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var phantom, phantomJsPrebuilt;
try {
  phantom = _phantom2.default;
  phantomJsPrebuilt = _phantomjsPrebuilt2.default;
} catch (err) {
  throw new Error("Unable to run tests in PhantomJS because the required dependencies are " + "not available. Please note that JSHint does not support development " + "using versions of Node.js which are no longer maintained.");
}

var options = {
  /**
   * The `phantom` module provides a Node.js API for the PhantomJS binary,
   * while the `phantomjs` module includes the binary itself.
   */
  phantomPath: phantomJsPrebuilt.path
};
var port = process.env.NODE_PORT || 8045;
var ph;

phantom.create([], options).then(function (_ph) {
  ph = _ph;
  return ph.createPage();
}).then(function (page) {
  (0, _server.serverjs)(port, function (server) {
    page.on("onConsoleMessage", function (str) {
      console.log(str);
    });

    page.on("onCallback", function (err) {
      ph.exit();
      server.close();
      if (err) {
        process.exit(1);
      }
    });

    page.on("onError", function (msg, trace) {
      console.error(msg);
      console.error(trace);
      process.exit(1);
    });

    return page.open("http://localhost:" + port);
  });
}).then(null, function (err) {
  console.error(err);
  process.exit(1);
});
