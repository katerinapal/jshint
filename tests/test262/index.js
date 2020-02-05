#! /usr/bin/env node
"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _test262Stream = require("test262-stream");

var _test262Stream2 = _interopRequireDefault(_test262Stream);

var _resultsInterpreter = require("results-interpreter");

var _resultsInterpreter2 = _interopRequireDefault(_resultsInterpreter);

var _test = require("./test");

var _report = require("./report");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var Transform = _stream2.default.Transform;

var expectationsFile = _path2.default.join(__dirname, "expectations.txt");
var shouldUpdate = process.argv.indexOf("--update-expectations") > -1;
var stream = new _test262Stream2.default(_path2.default.join(__dirname, "test262"), {
  omitRuntime: true
});
var count = 0;

function normalizePath(str) {
  return str.split(_path2.default.sep).join(_path2.default.posix.sep);
}

var results = new Transform({
  objectMode: true,
  transform: function transform(test, encoding, done) {
    count += 1;
    if (count % 2000 === 0) {
      console.log("Completed " + count + " tests.");
    }

    done(null, {
      id: normalizePath(test.file) + "(" + test.scenario + ")",
      expected: test.attrs.negative && test.attrs.negative.phase === "parse" ? "fail" : "pass",
      actual: (0, _test.testjs)(test) ? "pass" : "fail"
    });
  }
});
var interpreter = new _resultsInterpreter2.default(expectationsFile, {
  outputFile: shouldUpdate ? expectationsFile : null
});

console.log("Now running tests...");

if (shouldUpdate) {
  console.log("The expectations file will be updated according to the results of this " + "test run.");
} else {
  console.log("Note: the expectations file may be automatically updated by specifying " + "the `--update-expectations` flag.");
}

stream.pipe(results).pipe(interpreter).on("error", function (error) {
  console.error(error);
  process.exitCode = 1;
}).on("finish", function () {
  (0, _report.reportjs)(this.summary);
  process.exitCode = this.summary.passed ? 0 : 1;
});
