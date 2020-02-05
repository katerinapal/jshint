"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var exported_defaultjs = {
  reporter: function reporter(results, data, opts) {
    var len = results.length;
    var str = '';
    var prevfile;

    opts = opts || {};

    results.forEach(function (result) {
      var file = result.file;
      var error = result.error;

      if (prevfile && prevfile !== file) {
        str += "\n";
      }
      prevfile = file;

      str += file + ': line ' + error.line + ', col ' + error.character + ', ' + error.reason;

      if (opts.verbose) {
        str += ' (' + error.code + ')';
      }

      str += '\n';
    });

    if (str) {
      console.log(str + "\n" + len + ' error' + (len === 1 ? '' : 's'));
    }
  }
};

var exported_defaultjs_reporter = function exported_defaultjs_reporter(results, data, opts) {
  var len = results.length;
  var str = "";
  var prevfile;

  opts = opts || {};

  results.forEach(function (result) {
    var file = result.file;
    var error = result.error;

    if (prevfile && prevfile !== file) {
      str += "\n";
    }
    prevfile = file;

    str += file + ": line " + error.line + ", col " + error.character + ", " + error.reason;

    if (opts.verbose) {
      str += " (" + error.code + ")";
    }

    str += "\n";
  });

  if (str) {
    console.log(str + "\n" + len + " error" + (len === 1 ? "" : "s"));
  }
};

exports.reporter = exported_defaultjs_reporter;
