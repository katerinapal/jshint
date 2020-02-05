/*
 * Regular expressions. Some of these are stupidly long.
 */

/*jshint maxlen:1000 */

"use strict";

var unsafeString = unsafeString =
  /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

var needEsc = needEsc =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

var needEscGlobal = needEscGlobal =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

var starSlash = starSlash = /\*\//;
var identifier = identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;
var javascriptURL = javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;
var fallsThrough = fallsThrough = /^\s*falls?\sthrough\s*$/;
var maxlenException = maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/;
var whitespace = whitespace = /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;
var nonzeroDigit = nonzeroDigit = /^[1-9]$/;
var decimalDigit = decimalDigit = /^[0-9]$/;
var regexpSyntaxChars = regexpSyntaxChars = /[\^$\\.*+?()[\]{}|]/;
var regexpQuantifiers = regexpQuantifiers = /[*+?{]/;
var regexpCharClasses = regexpCharClasses = /[dDsSwW]/;
var regexpDot = regexpDot = /(^|[^\\])(\\\\)*\./;
export { unsafeString };
export { needEsc };
export { needEscGlobal };
export { starSlash };
export { identifier };
export { javascriptURL };
export { fallsThrough };
export { maxlenException };
export { whitespace };
export { nonzeroDigit };
export { decimalDigit };
export { regexpSyntaxChars };
export { regexpQuantifiers };
export { regexpCharClasses };
export { regexpDot };
