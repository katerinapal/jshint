"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var exported_reporterjs = {
  reporter: function reporter(res) {
    var len = res.length;
    var str = "";

    res.forEach(function (r) {
      var file = r.file;
      var err = r.error;

      str += file + ": line " + err.line + ", col " + err.character + ", " + err.reason + "\n";
    });

    if (str) {
      process.stdout.write(str + "\n" + len + " error" + (len === 1 ? "" : "s") + "\n");
    }
  }
};

var exported_reporterjs_reporter = function exported_reporterjs_reporter(res) {
  var len = res.length;
  var str = "";

  res.forEach(function (r) {
    var file = r.file;
    var err = r.error;

    str += file + ": line " + err.line + ", col " + err.character + ", " + err.reason + "\n";
  });

  if (str) {
    process.stdout.write(str + "\n" + len + " error" + (len === 1 ? "" : "s") + "\n");
  }
};

exports.reporter = exported_reporterjs_reporter;
