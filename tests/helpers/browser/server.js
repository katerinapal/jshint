import ext_fs_fs from "fs";
import ext_http_http from "http";
import ext_stream_Stream from "stream";
import ext_path_path from "path";
import ext_url_url from "url";
import ext_browserify_browserify from "browserify";
"use strict";
var buildJSHint = require(__dirname + "/../../../scripts/build");

var mainPath = ext_path_path.resolve(
  __dirname + "/../../../" + null
);
var contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript"
};

var streams = {
  fixtures: function() {
    var fixtureDir = __dirname + "/../../unit/fixtures";
    var fixtureStream = new ext_stream_Stream.Readable();
    fixtureStream._read = fixtureStream.write = function() {};

    ext_fs_fs.readdir(fixtureDir, function(err, files) {
      var src = "";
      var fsCache = {};

      if (err) {
        done(err);
        return;
      }

      files.forEach(function(fileName) {
        var relativeName = "/tests/unit/fixtures/" + fileName;

        fsCache[relativeName] = ext_fs_fs.readFileSync(
          fixtureDir + "/" + fileName, { encoding: "utf-8" }
        );
      });

      src += [
        "(function() {",
        "  window.JSHintTestFixtures = " + JSON.stringify(fsCache) + ";",
        "}());"
      ].join("\n");
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
  runAllScript: function() {
    var testDir = "../../unit";
    var stream = new ext_stream_Stream.Readable();
    stream._read = stream.write = function() {};

    ext_fs_fs.readdir(__dirname + "/" + testDir, function(err, allFiles) {
      var testIncludes = allFiles.filter(function(file) {
          return /\.js$/i.test(file);
        }).map(function(file) {
          return "\"" + file + "\": require(\"" + testDir + "/" + file + "\")";
        }).join(",\n");

      ext_fs_fs.readFile(__dirname + "/run-all.js.tmpl", function(err, src) {
        stream.push(
          String(src).replace(/{{\s*INJECT_TEST_INCLUDES\s*}}/, testIncludes)
        );
        stream.push(null);
      });
    });

    return stream;
  }
};

var build = {
  "index.html": function(done) {
    ext_fs_fs.readFile(__dirname + "/index.html", done);
  },

  "jshint.js": function(done) {
    buildJSHint("web", function(err, version, src) {
      done(err, src);
    });
  },

  "tests.js": function(done) {
    var bundle = ext_browserify_browserify({
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
        __dirname: function() {
          return "'/tests/unit'";
        }
      }
    });
    var includedFaker = false;

    bundle.require(
      ext_fs_fs.createReadStream(__dirname + "/fixture-fs.js"),
      { expose: "fs" }
    );
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
    bundle.transform(function(filename) {
      var faker;

      if (filename === mainPath) {
        includedFaker = true;
        faker = new ext_stream_Stream.Readable();
        faker._read = faker.write = function() {};
        faker.push("exports.JSHINT = window.JSHINT;");
        faker.push(null);
        return faker;
      }

      return new ext_stream_Stream.PassThrough();
    });

    bundle.bundle(function(err, src) {
      if (err) {
        done(err);
        return;
      }

      if (!includedFaker) {
        done(new Error(
          "JSHint extraction module not included in bundled test build."
        ));
        return;
      }

      done(null, src);
    });
  }
};

var exportedObject = function(port, done) {
  var server = ext_http_http.createServer(function(req, res) {
    var pathname = ext_url_url.parse(req.url).pathname.slice(1) || "index.html";
    var contentType = contentTypes[ext_path_path.extname(pathname)];

    if (!Object.hasOwnProperty.call(build, pathname)) {
      res.statusCode = 404;
      res.end("not found");
    }

    build[pathname](function(err, src) {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }

      res.setHeader("content-type", contentType);
      res.setHeader(
        "Cache-Control", "private, no-cache, no-store, must-revalidate"
      );
      res.setHeader("Expires", "-1");
      res.setHeader("Pragma", "no-cache");

      res.end(src);
    });
  });

  server.listen(port, function() {
    done(server);
  });
};

export { exportedObject as serverjs };


if (require.main === module) {
  console.log("Starting JSHint browser build testing server.");
  console.log(
    "(override default port via the NODE_PORT environmental variable)"
  );

  server_exportedObject(process.env.NODE_PORT || 8045, function(server) {
    console.log("Server now listening on port " + server.address().port);
  });
}
