"use strict";

var exported_reporterjs = {
  reporter: function (res) {
    var len = res.length;
    var str = "";

    res.forEach(function (r) {
      var file = r.file;
      var err = r.error;

      str += file + ": line " + err.line + ", col " +
        err.character + ", " + err.reason + "\n";
    });

    if (str) {
      process.stdout.write(str + "\n" + len + " error" +
        ((len === 1) ? "" : "s") + "\n");
    }
  }
};

var exported_reporter = function(res) {
  var len = res.length;
  var str = "";

  res.forEach(function(r) {
    var file = r.file;
    var err = r.error;

    str += file + ": line " + err.line + ", col " + err.character + ", " + err.reason + "\n";
  });

  if (str) {
    process.stdout.write(str + "\n" + len + " error" + (len === 1 ? "" : "s") + "\n");
  }
};

export { exported_reporter as reporter };
