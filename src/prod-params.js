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

var exported_export = 1;
var exported_noin = 2;
var exported_initial = 4;
var exported_preAsync = 8;
var exported_async = 16;
var exported_tryClause = 32;
export { exported_export as export, exported_noin as noin, exported_initial as initial, exported_preAsync as preAsync, exported_async as async, exported_tryClause as tryClause };
