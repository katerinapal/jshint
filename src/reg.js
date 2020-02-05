/*
 * Regular expressions. Some of these are stupidly long.
 */

/*jshint maxlen:1000 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var exported_unsafeString = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;
var exported_needEsc = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
var exported_needEscGlobal = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var exported_starSlash = /\*\//;
var exported_identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;
var exported_javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;
var exported_fallsThrough = /^\s*falls?\sthrough\s*$/;
var exported_maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/;
var exported_whitespace = /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;
var exported_nonzeroDigit = /^[1-9]$/;
var exported_decimalDigit = /^[0-9]$/;
var exported_regexpSyntaxChars = /[\^$\\.*+?()[\]{}|]/;
var exported_regexpQuantifiers = /[*+?{]/;
var exported_regexpCharClasses = /[dDsSwW]/;
var exported_regexpDot = /(^|[^\\])(\\\\)*\./;
exports.unsafeString = exported_unsafeString;
exports.needEsc = exported_needEsc;
exports.needEscGlobal = exported_needEscGlobal;
exports.starSlash = exported_starSlash;
exports.identifier = exported_identifier;
exports.javascriptURL = exported_javascriptURL;
exports.fallsThrough = exported_fallsThrough;
exports.maxlenException = exported_maxlenException;
exports.whitespace = exported_whitespace;
exports.nonzeroDigit = exported_nonzeroDigit;
exports.decimalDigit = exported_decimalDigit;
exports.regexpSyntaxChars = exported_regexpSyntaxChars;
exports.regexpQuantifiers = exported_regexpQuantifiers;
exports.regexpCharClasses = exported_regexpCharClasses;
exports.regexpDot = exported_regexpDot;
