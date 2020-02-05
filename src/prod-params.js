Object.defineProperty(exports, "__esModule", {
  value: true
});
var exported_prodparamsjs = {
  /**
   * Enabled when parsing expressions within ES2015 "export" declarations,
   * allowing otherwise-unreferenced bindings to be considered "used".
   */
  export: 1,

  /**
   * Enabled when parsing expressions within the head of `for` statements,
   * allowing to distinguish between `for-in` and "C-style" `for` statements.
   */
  noin: 2,

  /**
   * Enabled when the expression begins the statement, allowing the parser to
   * correctly select between the null denotation ("nud") and first null
   * denotation ("fud") parsing strategy.
   */
  initial: 4,

  preAsync: 8,

  async: 16,

  /**
   * Enabled when any exception thrown by the expression will be caught by a
   * TryStatement.
   */
  tryClause: 32
};

var exported_prodparamsjs_export = 1;
var exported_prodparamsjs_noin = 2;
var exported_prodparamsjs_initial = 4;
var exported_prodparamsjs_preAsync = 8;
var exported_prodparamsjs_async = 16;
var exported_prodparamsjs_tryClause = 32;
exports.export = exported_prodparamsjs_export;
exports.noin = exported_prodparamsjs_noin;
exports.initial = exported_prodparamsjs_initial;
exports.preAsync = exported_prodparamsjs_preAsync;
exports.async = exported_prodparamsjs_async;
exports.tryClause = exported_prodparamsjs_tryClause;
