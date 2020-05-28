/*
 * Regular expressions. Some of these are stupidly long.
 */

/*jshint maxlen:1000 */

"use strict";

// Unsafe comment or string (ax)
unsafeString_unsafeString =
  /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

// Characters in strings that need escaping (nx and nxg)
needEsc_needEsc =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

needEscGlobal_needEscGlobal =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

// Star slash (lx)
starSlash_starSlash = /\*\//;

// Identifier (ix)
identifier_identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

// JavaScript URL (jx)
javascriptURL_javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;

// Catches /* falls through */ comments (ft)
fallsThrough_fallsThrough = /^\s*falls?\sthrough\s*$/;

// very conservative rule (eg: only one space between the start of the comment and the first character)
// to relax the maxlen option
maxlenException_maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/;

// Node.js releases prior to version 8 include a version of the V8 engine which
// incorrectly interprets the character class escape `\s`. The following
// regular expression may be replaced with `/\s/` when JSHint removes support
// for Node.js versions prior to 8.
// Source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
whitespace_whitespace = /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;

nonzeroDigit_nonzeroDigit = /^[1-9]$/;

decimalDigit_decimalDigit = /^[0-9]$/;

regexpSyntaxChars_regexpSyntaxChars = /[\^$\\.*+?()[\]{}|]/;

regexpQuantifiers_regexpQuantifiers = /[*+?{]/;

regexpCharClasses_regexpCharClasses = /[dDsSwW]/;

// Identifies the "dot" atom in regular expressions
regexpDot_regexpDot = /(^|[^\\])(\\\\)*\./;
var unsafeString_unsafeString;
export { unsafeString_unsafeString as unsafeString };
var needEsc_needEsc;
export { needEsc_needEsc as needEsc };
var needEscGlobal_needEscGlobal;
export { needEscGlobal_needEscGlobal as needEscGlobal };
var starSlash_starSlash;
export { starSlash_starSlash as starSlash };
var identifier_identifier;
export { identifier_identifier as identifier };
var javascriptURL_javascriptURL;
export { javascriptURL_javascriptURL as javascriptURL };
var fallsThrough_fallsThrough;
export { fallsThrough_fallsThrough as fallsThrough };
var maxlenException_maxlenException;
export { maxlenException_maxlenException as maxlenException };
var whitespace_whitespace;
export { whitespace_whitespace as whitespace };
var nonzeroDigit_nonzeroDigit;
export { nonzeroDigit_nonzeroDigit as nonzeroDigit };
var decimalDigit_decimalDigit;
export { decimalDigit_decimalDigit as decimalDigit };
var regexpSyntaxChars_regexpSyntaxChars;
export { regexpSyntaxChars_regexpSyntaxChars as regexpSyntaxChars };
var regexpQuantifiers_regexpQuantifiers;
export { regexpQuantifiers_regexpQuantifiers as regexpQuantifiers };
var regexpCharClasses_regexpCharClasses;
export { regexpCharClasses_regexpCharClasses as regexpCharClasses };
var regexpDot_regexpDot;
export { regexpDot_regexpDot as regexpDot };
