"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serverjs = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _browserify = require("browserify");

var _browserify2 = _interopRequireDefault(_browserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";
var buildJSHint = require(__dirname + "/../../../scripts/build");

var mainPath = _path2.default.resolve(__dirname + "/../../../" + require("../../../package.json").main);
var contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript"
};

var streams = {
  fixtures: function fixtures() {
    var fixtureDir = __dirname + "/../../unit/fixtures";
    var fixtureStream = new _stream2.default.Readable();
    fixtureStream._read = fixtureStream.write = function () {};

    _fs2.default.readdir(fixtureDir, function (err, files) {
      var src = "";
      var fsCache = {};

      if (err) {
        done(err);
        return;
      }

      files.forEach(function (fileName) {
        var relativeName = "/tests/unit/fixtures/" + fileName;

        fsCache[relativeName] = _fs2.default.readFileSync(fixtureDir + "/" + fileName, { encoding: "utf-8" });
      });

      src += ["(function() {", "  window.JSHintTestFixtures = " + JSON.stringify(fsCache) + ";", "}());"].join("\n");
      fixtureStream.push(src);
      fixtureStream.push(null);
    });

    return fixtureStream;
  },

  /**
   * This script is dependent on the contents of the unit test file directory.
   * It must be generated dynamically for two reasons:
   *
   * 1. So that Browserify includes the test files in the generated bundle
   * 2. So that Nodeunit is explicitly invoked with the tests
   *
   * Although #1 could be addressed through the Browserify API itself, #2 means
   * that passively including the modules will not result in test
   * execution--some code generation is required.
   */
  runAllScript: function runAllScript() {
    var testDir = "../../unit";
    var stream = new _stream2.default.Readable();
    stream._read = stream.write = function () {};

    _fs2.default.readdir(__dirname + "/" + testDir, function (err, allFiles) {
      var testIncludes = allFiles.filter(function (file) {
        return (/\.js$/i.test(file)
        );
      }).map(function (file) {
        return "\"" + file + "\": require(\"" + testDir + "/" + file + "\")";
      }).join(",\n");

      _fs2.default.readFile(__dirname + "/run-all.js.tmpl", function (err, src) {
        stream.push(String(src).replace(/{{\s*INJECT_TEST_INCLUDES\s*}}/, testIncludes));
        stream.push(null);
      });
    });

    return stream;
  }
};

var build = {
  "index.html": function indexHtml(done) {
    _fs2.default.readFile(__dirname + "/index.html", done);
  },

  "jshint.js": function jshintJs(done) {
    buildJSHint("web", function (err, version, src) {
      done(err, src);
    });
  },

  "tests.js": function testsJs(done) {
    var bundle = (0, _browserify2.default)({
      insertGlobalVars: {
        /**
         * Ensure that the value of `__dirname` uses Unix path separator across
         * all platforms.
         *
         * By default, Browserify defines the `__dirname` global using the
         * system's native file separator character, but its implementation of
         * `path.resolve` (as used in `fixture-fs.js`) only includes the Unix
         * implementation. This inconsistency does not impact file lookup on
         * either platform, but when path strings are used as key values (as is
         * the case in `fixture-fs.js`), the separator character must be
         * consistent.
         */
        __dirname: function __dirname() {
          return "'/tests/unit'";
        }
      }
    });
    var includedFaker = false;

    bundle.require(_fs2.default.createReadStream(__dirname + "/fixture-fs.js"), { expose: "fs" });
    bundle.add(streams.fixtures());
    bundle.add(streams.runAllScript(), { basedir: __dirname });

    /**
     * When Browserify attempts to bundle the JSHint source, inject a simple
     * "global extraction module"--a CommonJS module that simply exposes the
     * globally-defined JSHint instance. This ensures that the tests run
     * against the version of JSHint built with the project's build script (see
     * above) and not a version dynamically included in the current bundle for
     * test files.
     */
    bundle.transform(function (filename) {
      var faker;

      if (filename === mainPath) {
        includedFaker = true;
        faker = new _stream2.default.Readable();
        faker._read = faker.write = function () {};
        faker.push("exports.JSHINT = window.JSHINT;");
        faker.push(null);
        return faker;
      }

      return new _stream2.default.PassThrough();
    });

    bundle.bundle(function (err, src) {
      if (err) {
        done(err);
        return;
      }

      if (!includedFaker) {
        done(new Error("JSHint extraction module not included in bundled test build."));
        return;
      }

      done(null, src);
    });
  }
};

var exportedObject = function exportedObject(port, done) {
  var server = _http2.default.createServer(function (req, res) {
    var pathname = _url2.default.parse(req.url).pathname.slice(1) || "index.html";
    var contentType = contentTypes[_path2.default.extname(pathname)];

    if (!Object.hasOwnProperty.call(build, pathname)) {
      res.statusCode = 404;
      res.end("not found");
    }

    build[pathname](function (err, src) {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }

      res.setHeader("content-type", contentType);
      res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
      res.setHeader("Expires", "-1");
      res.setHeader("Pragma", "no-cache");

      res.end(src);
    });
  });

  server.listen(port, function () {
    done(server);
  });
};

exports.serverjs = exportedObject;
;

if (require.main === module) {
  console.log("Starting JSHint browser build testing server.");
  console.log("(override default port via the NODE_PORT environmental variable)");

  module.exports(process.env.NODE_PORT || 8045, function (server) {
    console.log("Server now listening on port " + server.address().port);
  });
}
