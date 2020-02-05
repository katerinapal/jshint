import phantom from "phantom";
import phantomjsprebuilt from "phantomjs-prebuilt";
import { serverjs as createTestServer } from "./helpers/browser/server";
"use strict";

try {
  phantom = phantom;
  phantomJsPrebuilt = phantomjsprebuilt;
} catch (err) {
  throw new Error(
    "Unable to run tests in PhantomJS because the required dependencies are " +
    "not available. Please note that JSHint does not support development " +
    "using versions of Node.js which are no longer maintained."
  );
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

phantom.create([], options)
  .then(function(_ph) {
      ph = _ph;
      return ph.createPage();
    })
  .then(function(page) {
      createTestServer(port, function(server) {
        page.on("onConsoleMessage", function(str) {
          console.log(str);
        });

        page.on("onCallback", function(err) {
          ph.exit();
          server.close();
          if (err) {
            process.exit(1);
          }
        });

        page.on("onError", function(msg, trace) {
          console.error(msg);
          console.error(trace);
          process.exit(1);
        });

        return page.open("http://localhost:" + port);
      });
    })
  .then(null, function(err) {
      console.error(err);
      process.exit(1);
    });
