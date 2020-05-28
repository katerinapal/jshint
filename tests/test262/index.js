#! /usr/bin/env node

import ext_path_path from "path";
import ext_stream_stream from "stream";
import ext_test262stream_Test262Stream from "test262-stream";
import ext_resultsinterpreter_Interpreter from "results-interpreter";
import { testjs as test_testjsjs } from "./test";
import { reportjs as report_reportjsjs } from "./report";

"use strict";

var Transform = ext_stream_stream.Transform;

var expectationsFile = ext_path_path.join(__dirname, "expectations.txt");
var shouldUpdate = process.argv.indexOf("--update-expectations") > -1;
var stream = new ext_test262stream_Test262Stream(ext_path_path.join(__dirname, "test262"), {
  omitRuntime: true
});
var count = 0;

function normalizePath(str) {
  return str.split(ext_path_path.sep).join(ext_path_path.posix.sep);
}

var results = new Transform({
  objectMode: true,
  transform: function(test, encoding, done) {
    count += 1;
    if (count % 2000 === 0) {
      console.log("Completed " + count + " tests.");
    }

    done(null, {
      id: normalizePath(test.file) + "(" + test.scenario + ")",
      expected: test.attrs.negative && test.attrs.negative.phase === "parse"
        ? "fail" : "pass",
      actual: test_testjsjs(test) ? "pass": "fail"
    });
  }
});
var interpreter = new ext_resultsinterpreter_Interpreter(expectationsFile, {
  outputFile: shouldUpdate ? expectationsFile : null
});

console.log("Now running tests...");

if (shouldUpdate) {
  console.log(
    "The expectations file will be updated according to the results of this " +
    "test run."
  );
} else {
  console.log(
    "Note: the expectations file may be automatically updated by specifying " +
    "the `--update-expectations` flag."
  );
}

stream.pipe(results)
  .pipe(interpreter)
  .on("error", function(error) {
    console.error(error);
    process.exitCode = 1;
  })
  .on("finish", function () {
    report_reportjsjs(this.summary);
    process.exitCode = this.summary.passed ? 0 : 1;
  });
