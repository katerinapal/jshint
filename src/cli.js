"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clijs = undefined;

var _jshint = require("./jshint.js");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _cli = require("cli");

var _cli2 = _interopRequireDefault(_cli);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _minimatch = require("minimatch");

var _minimatch2 = _interopRequireDefault(_minimatch);

var _htmlparser = require("htmlparser2");

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _exit = require("exit");

var _exit2 = _interopRequireDefault(_exit);

var _stripJsonComments = require("strip-json-comments");

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

var _default = require("./reporters/default");

var default_moduleObject = _interopRequireWildcard(_default);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var defReporter = default_moduleObject.reporter;

var OPTIONS = {
  "config": ["c", "Custom configuration file", "string", false],
  "reporter": ["reporter", "Custom reporter (<PATH>|jslint|checkstyle|unix)", "string", undefined],
  "prereq": ["prereq", "Comma-separated list of prerequisites (paths). E.g. files which include " + "definitions of global variables used throughout your project", "string", null],
  "exclude": ["exclude", "Exclude files matching the given filename pattern (same as .jshintignore)", "string", null],
  "exclude-path": ["exclude-path", "Pass in a custom jshintignore file path", "string", null],
  "filename": ["filename", "Pass in a filename when using STDIN to emulate config lookup for that file name", "string", null],
  "verbose": ["verbose", "Show message codes"],
  "show-non-errors": ["show-non-errors", "Show additional data generated by jshint"],
  "extra-ext": ["e", "Comma-separated list of file extensions to use (default is .js)", "string", ""],

  "extract": ["extract", "Extract inline scripts contained in HTML (auto|always|never, default to never)", "string", "never"],

  // Deprecated options.
  "jslint-reporter": ["jslint-reporter", deprecated("Use a jslint compatible reporter", "--reporter=jslint")],

  "checkstyle-reporter": ["checkstyle-reporter", deprecated("Use a CheckStyle compatible XML reporter", "--reporter=checkstyle")]
};

/**
 * Returns the same text but with a deprecation notice.
 * Useful for options descriptions.
 *
 * @param {string} text
 * @param {string} alt (optional) Alternative command to include in the
 *                 deprecation notice.
 *
 * @returns {string}
 */
function deprecated(text, alt) {
  if (!alt) {
    return text + " (DEPRECATED)";
  }

  return text + " (DEPRECATED, use " + alt + " instead)";
}

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
function findConfig(file) {
  var dir = _path2.default.dirname(_path2.default.resolve(file));
  var envs = getHomeDir();
  var proj = findFile(".jshintrc", dir);
  var home;

  if (proj) return proj;else if (envs) {
    home = _path2.default.normalize(_path2.default.join(envs, ".jshintrc"));

    if (_shelljs2.default.test("-e", home)) return home;
  }

  return null;
}

function getHomeDir() {
  var homePath = "";
  var environment = global.process.env;
  var paths = [environment.USERPROFILE, environment.HOME, environment.HOMEPATH, environment.HOMEDRIVE + environment.HOMEPATH];

  while (paths.length) {
    homePath = paths.shift();
    if (_fs2.default.existsSync(homePath)) {
      return homePath;
    }
  }
}

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
function loadNpmConfig(file) {
  var dir = _path2.default.dirname(_path2.default.resolve(file));
  var fp = findFile("package.json", dir);

  if (!fp) return null;

  try {
    return require(fp).jshintConfig;
  } catch (e) {
    return null;
  }
}

/**
 * Tries to import a reporter file and returns its reference.
 *
 * @param {string} fp a path to the reporter file
 * @returns {object} imported module for the reporter or 'null'
 *                   if a module cannot be imported.
 */
function loadReporter(fp) {
  try {
    return require(fp).reporter;
  } catch (err) {
    return null;
  }
}

// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from (default:
 *                      current working directory)
 *
 * @returns {string} normalized filename
 */
function findFile(name, cwd) {
  cwd = cwd || process.cwd();

  var filename = _path2.default.normalize(_path2.default.join(cwd, name));
  if (findFileResults[filename] !== undefined) {
    return findFileResults[filename];
  }

  var parent = _path2.default.resolve(cwd, "../");

  if (_shelljs2.default.test("-e", filename)) {
    findFileResults[filename] = filename;
    return filename;
  }

  if (cwd === parent) {
    findFileResults[filename] = null;
    return null;
  }

  return findFile(name, parent);
}

/**
 * Loads a list of files that have to be skipped. JSHint assumes that
 * the list is located in a file called '.jshintignore'.
 *
 * @return {array} a list of files to ignore.
 */
function loadIgnores(params) {
  var file = findFile(params.excludePath || ".jshintignore", params.cwd) || "";

  if (!file && !params.exclude) {
    return [];
  }

  var lines = (file ? _shelljs2.default.cat(file) : "").split("\n");
  var exclude = params.exclude || "";
  lines.unshift.apply(lines, exclude.split(","));

  return lines.filter(function (line) {
    return !!line.trim();
  }).map(function (line) {
    if (line[0] === "!") return "!" + _path2.default.resolve(_path2.default.dirname(file), line.substr(1).trim());

    return _path2.default.join(_path2.default.dirname(file), line.trim());
  });
}

/**
 * Checks whether we should ignore a file or not.
 *
 * @param {string} fp       a path to a file
 * @param {array}  patterns a list of patterns for files to ignore
 *
 * @return {boolean} 'true' if file should be ignored, 'false' otherwise.
 */
function isIgnored(fp, patterns) {
  return patterns.some(function (ip) {
    if ((0, _minimatch2.default)(_path2.default.resolve(fp), ip, { nocase: true, dot: true })) {
      return true;
    }

    if (_path2.default.resolve(fp) === ip) {
      return true;
    }

    if (_shelljs2.default.test("-d", fp) && ip.match(/^[^\/\\]*[\/\\]?$/) && fp.match(new RegExp("^" + ip + ".*"))) {
      return true;
    }
  });
}

/**
 * Extract JS code from a given source code. The source code my be either HTML
 * code or JS code. In the latter case, no extraction will be done unless
 * 'always' is given.
 *
 * @param {string} code a piece of code
 * @param {string} when 'always' will extract the JS code, no matter what.
 * 'never' won't do anything. 'auto' will check if the code looks like HTML
 * before extracting it.
 *
 * @return {string} the extracted code
 */
function extract(code, when) {
  // A JS file won't start with a less-than character, whereas a HTML file
  // should always start with that.
  if (when !== "always" && (when !== "auto" || !/^\s*</.test(code))) return code;

  var inscript = false;
  var index = 0;
  var js = [];
  var startOffset;

  // Test if current tag is a valid <script> tag.
  function onopen(name, attrs) {
    if (name !== "script") return;

    if (attrs.type && !/text\/javascript/.test(attrs.type.toLowerCase())) return;

    // Mark that we're inside a <script> a tag and push all new lines
    // in between the last </script> tag and this <script> tag to preserve
    // location information.
    inscript = true;
    js.push.apply(js, code.slice(index, parser.endIndex).match(/\r\n|\n|\r/g));
    startOffset = null;
  }

  function onclose(name) {
    if (name !== "script" || !inscript) return;

    inscript = false;
    index = parser.startIndex;
    startOffset = null;
  }

  function ontext(data) {
    if (!inscript) return;

    var lines = data.split(/\r\n|\n|\r/);

    if (!startOffset) {
      lines.some(function (line) {
        if (!line) return;
        startOffset = /^(\s*)/.exec(line)[1];
        return true;
      });
    }

    // check for startOffset again to remove leading white space from first line
    if (startOffset) {
      lines = lines.map(function (line) {
        return line.replace(startOffset, "");
      });
      data = lines.join("\n");
    }

    js.push(data); // Collect JavaScript code.
  }

  var parser = new _htmlparser2.default.Parser({ onopentag: onopen, onclosetag: onclose, ontext: ontext });
  parser.parseComplete(code);

  return js.join("");
}

/**
 * Crude version of source maps: extract how much JavaSscript in HTML
 * was shifted based on first JS line. For example if first js line
 * is offset by 4 spaces, each line in this js fragment will have offset 4
 * to restore the original column.
 *
 * @param {string} code a piece of code
 * @param {string} when 'always' will extract the JS code, no matter what.
 * 'never' won't do anything. 'auto' will check if the code looks like HTML
 * before extracting it.
 *
 * @return {Array} extracted offsets
 */
function extractOffsets(code, when) {
  // A JS file won't start with a less-than character, whereas a HTML file
  // should always start with that.
  if (when !== "always" && (when !== "auto" || !/^\s*</.test(code))) return;

  var inscript = false;
  var index = 0;
  var lineCounter = 0;
  var startOffset;
  var offsets = [];

  // Test if current tag is a valid <script> tag.
  function onopen(name, attrs) {
    if (name !== "script") return;

    if (attrs.type && !/text\/javascript/.test(attrs.type.toLowerCase())) return;

    // Mark that we're inside a <script> a tag and push all new lines
    // in between the last </script> tag and this <script> tag to preserve
    // location information.
    inscript = true;
    var fragment = code.slice(index, parser.endIndex);
    var n = (fragment.match(/\r\n|\n|\r/g) || []).length;
    lineCounter += n;
    startOffset = null;
  }

  function onclose(name) {
    if (name !== "script" || !inscript) return;

    inscript = false;
    index = parser.startIndex;
    startOffset = null;
  }

  function ontext(data) {
    if (!inscript) return;

    var lines = data.split(/\r\n|\n|\r/);

    if (!startOffset) {
      lines.some(function (line) {
        if (!line) return;
        startOffset = /^(\s*)/.exec(line)[1];
        return true;
      });
    }

    // check for startOffset again to remove leading white space from first line
    lines.forEach(function () {
      lineCounter += 1;
      if (startOffset) {
        offsets[lineCounter] = startOffset.length;
      } else {
        offsets[lineCounter] = 0;
      }
    });
  }

  var parser = new _htmlparser2.default.Parser({ onopentag: onopen, onclosetag: onclose, ontext: ontext });
  parser.parseComplete(code);
  return offsets;
}

/**
 * Recursively gather all files that need to be linted,
 * excluding those that user asked to ignore.
 *
 * @param {string} fp      a path to a file or directory to lint
 * @param {array}  files   a pointer to an array that stores a list of files
 * @param {array}  ignores a list of patterns for files to ignore
 * @param {array}  ext     a list of non-dot-js extensions to lint
 */
function collect(fp, files, ignores, ext) {
  if (ignores && isIgnored(fp, ignores)) {
    return;
  }

  if (!_shelljs2.default.test("-e", fp)) {
    _cli2.default.error("Can't open " + fp);
    return;
  }

  if (_shelljs2.default.test("-d", fp)) {
    _shelljs2.default.ls(fp).forEach(function (item) {
      var itempath = _path2.default.join(fp, item);
      if (_shelljs2.default.test("-d", itempath) || item.match(ext)) {
        collect(itempath, files, ignores, ext);
      }
    });

    return;
  }

  files.push(fp);
}

/**
 * Runs JSHint against provided file and saves the result
 *
 * @param {string} code    code that needs to be linted
 * @param {object} results a pointer to an object with results
 * @param {object} config  an object with JSHint configuration
 * @param {object} data    a pointer to an object with extra data
 * @param {string} file    (optional) file name that is being linted
 */
function lint(code, results, config, data, file) {
  var globals;
  var lintData;
  var buffer = [];

  config = config || {};
  config = JSON.parse(JSON.stringify(config));

  if (config.prereq) {
    config.prereq.forEach(function (fp) {
      fp = _path2.default.join(config.dirname, fp);
      if (_shelljs2.default.test("-e", fp)) buffer.push(_shelljs2.default.cat(fp));
    });
    delete config.prereq;
  }

  if (config.globals) {
    globals = config.globals;
    delete config.globals;
  }

  if (config.overrides) {
    if (file) {
      _lodash2.default.each(config.overrides, function (options, pattern) {
        if ((0, _minimatch2.default)(_path2.default.normalize(file), pattern, { nocase: true, matchBase: true })) {
          if (options.globals) {
            globals = _lodash2.default.extend(globals || {}, options.globals);
            delete options.globals;
          }
          _lodash2.default.extend(config, options);
        }
      });
    }

    delete config.overrides;
  }

  delete config.dirname;

  buffer.push(code);
  buffer = buffer.join("\n");
  buffer = buffer.replace(/^\uFEFF/, ""); // Remove potential Unicode BOM.

  if (!(0, _jshint.JSHINT)(buffer, config, globals)) {
    _jshint.JSHINT.errors.forEach(function (err) {
      if (err) {
        results.push({ file: file || "stdin", error: err });
      }
    });
  }

  lintData = _jshint.JSHINT.data();

  if (lintData) {
    lintData.file = file || "stdin";
    data.push(lintData);
  }
}

var _exports = {
  extract: extract,
  exit: _exit2.default,

  /**
   * Returns a configuration file or nothing, if it can't be found.
   */
  getConfig: function getConfig(fp) {
    return loadNpmConfig(fp) || _exports.loadConfig(findConfig(fp));
  },

  /**
   * Loads and parses a configuration file.
   *
   * @param {string} fp a path to the config file
   * @returns {object} config object
   */
  loadConfig: function loadConfig(fp) {
    if (!fp) {
      return {};
    }

    if (!_shelljs2.default.test("-e", fp)) {
      _cli2.default.error("Can't find config file: " + fp);
      _exports.exit(1);
    }

    try {
      var config = JSON.parse((0, _stripJsonComments2.default)(_shelljs2.default.cat(fp)));
      config.dirname = _path2.default.dirname(fp);

      if (config['extends']) {
        var baseConfig = _exports.loadConfig(_path2.default.resolve(config.dirname, config['extends']));
        config = _lodash2.default.merge({}, baseConfig, config, function (a, b) {
          if (_lodash2.default.isArray(a)) {
            return a.concat(b);
          }
        });
        delete config['extends'];
      }

      return config;
    } catch (err) {
      _cli2.default.error("Can't parse config file: " + fp + "\nError:" + err);
      _exports.exit(1);
    }
  },

  /**
   * Gathers all files that need to be linted
   *
   * @param {object} post-processed options from 'interpret':
   *                   args     - CLI arguments
   *                   ignores  - A list of files/dirs to ignore (defaults to .jshintignores)
   *                   extensions - A list of non-dot-js extensions to check
   */
  gather: function gather(opts) {
    var files = [];

    var reg = new RegExp("\\.(js" + (!opts.extensions ? "" : "|" + opts.extensions.replace(/,/g, "|").replace(/[\. ]/g, "")) + ")$");

    var ignores = !opts.ignores ? loadIgnores({ cwd: opts.cwd }) : opts.ignores.map(function (target) {
      return _path2.default.resolve(target);
    });

    opts.args.forEach(function (target) {
      collect(target, files, ignores, reg);
    });

    return files;
  },

  /**
   * Gathers all files that need to be linted, lints them, sends them to
   * a reporter and returns the overall result.
   *
   * @param {object} post-processed options from 'interpret':
   *                 args     - CLI arguments
   *                 config   - Configuration object
   *                 reporter - Reporter function
   *                 ignores  - A list of files/dirs to ignore
   *                 extensions - A list of non-dot-js extensions to check
   * @param {function} cb a callback to call when function is finished
   *                   asynchronously.
   *
   * @returns {bool} 'true' if all files passed, 'false' otherwise and 'null'
   *                 when function will be finished asynchronously.
   */
  run: function run(opts, cb) {
    var files = _exports.gather(opts);
    var results = [];
    var data = [];

    function mergeCLIPrereq(config) {
      if (opts.prereq) {
        config.prereq = (config.prereq || []).concat(opts.prereq.split(/\s*,\s*/));
      }
    }

    var filename;

    // There is an if(filename) check in the lint() function called below.
    // passing a filename of undefined is the same as calling the function
    // without a filename.  If there is no opts.filename, filename remains
    // undefined and lint() is effectively called with 4 parameters.
    if (opts.filename) {
      filename = _path2.default.resolve(opts.filename);
    }
    if (opts.useStdin && opts.ignores.indexOf(filename) === -1) {
      _cli2.default.withStdin(function (code) {
        var config = opts.config;

        if (filename && !config) {
          config = _exports.getConfig(filename);
        }

        config = config || {};

        mergeCLIPrereq(config);

        lint(extract(code, opts.extract), results, config, data, filename);
        (opts.reporter || default_moduleObject.default_moduleObject)(results, data, { verbose: opts.verbose });
        cb(results.length === 0);
      });
      return null;
    }

    files.forEach(function (file) {
      var config = opts.config || _exports.getConfig(file);
      var code;
      var errors = [];

      try {
        code = _shelljs2.default.cat(file);
      } catch (err) {
        _cli2.default.error("Can't open " + file);
        _exports.exit(1);
      }

      mergeCLIPrereq(config);

      lint(extract(code, opts.extract), errors, config, data, file);

      if (errors.length) {
        var offsets = extractOffsets(code, opts.extract);
        if (offsets && offsets.length) {
          errors.forEach(function (errorInfo) {
            var line = errorInfo.error.line;
            if (line >= 0 && line < offsets.length && offsets[line]) {
              errorInfo.error.character += offsets[line];
            }
          });
        }

        results = results.concat(errors);
      }
    });

    (opts.reporter || default_moduleObject.default_moduleObject)(results, data, { verbose: opts.verbose });
    return results.length === 0;
  },

  /**
   * Helper exposed for testing.
   * Used to determine is stdout has any buffered output before exiting the program
   */
  getBufferSize: function getBufferSize() {
    return process.stdout.bufferSize;
  },

  /**
   * Main entrance function. Parses arguments and calls 'run' when
   * its done. This function is called from bin/jshint file.
   *
   * @param {object} args, arguments in the process.argv format.
   */
  interpret: function interpret(args) {
    _cli2.default.setArgv(args);
    _cli2.default.options = {};

    _cli2.default.enable("version", "glob", "help");
    _cli2.default.setApp(_path2.default.resolve(__dirname + "/../package.json"));

    var options = _cli2.default.parse(OPTIONS);
    // Use config file if specified
    var config;
    if (options.config) {
      config = _exports.loadConfig(options.config);
    }

    switch (true) {
      // JSLint reporter
      case options.reporter === "jslint":
      case options["jslint-reporter"]:
        options.reporter = "./reporters/jslint_xml.js";
        break;

      // CheckStyle (XML) reporter
      case options.reporter === "checkstyle":
      case options["checkstyle-reporter"]:
        options.reporter = "./reporters/checkstyle.js";
        break;

      // Unix reporter
      case options.reporter === "unix":
        options.reporter = "./reporters/unix.js";
        break;

      // Reporter that displays additional JSHint data
      case options["show-non-errors"]:
        options.reporter = "./reporters/non_error.js";
        break;

      // Custom reporter
      case options.reporter !== undefined:
        options.reporter = _path2.default.resolve(process.cwd(), options.reporter);
    }

    var reporter;
    if (options.reporter) {
      reporter = loadReporter(options.reporter);

      if (reporter === null) {
        _cli2.default.error("Can't load reporter file: " + options.reporter);
        _exports.exit(1);
      }
    }

    // This is a hack. exports.run is both sync and async function
    // because I needed stdin support (and cli.withStdin is async)
    // and was too lazy to change tests.

    function done(passed) {
      /*jshint eqnull:true */

      if (passed == null) return;

      _exports.exit(passed ? 0 : 2);
    }

    done(_exports.run({
      args: _cli2.default.args,
      config: config,
      reporter: reporter,
      ignores: loadIgnores({ exclude: options.exclude, excludePath: options["exclude-path"] }),
      extensions: options["extra-ext"],
      verbose: options.verbose,
      extract: options.extract,
      filename: options.filename,
      prereq: options.prereq,
      useStdin: { "-": true, "/dev/stdin": true }[args[args.length - 1]]
    }, done));
  }
};

var exported_clijs = _exports;
exports.clijs = exported_clijs;
