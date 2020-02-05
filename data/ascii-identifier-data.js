var identifierStartTable = [];

for (var i = 0; i < 128; i++) {
  identifierStartTable[i] =
    i === 36 ||           // $
    i >= 65 && i <= 90 || // A-Z
    i === 95 ||           // _
    i >= 97 && i <= 122;  // a-z
}

var identifierPartTable = [];

for (var i = 0; i < 128; i++) {
  identifierPartTable[i] =
    identifierStartTable[i] || // $, _, A-Z, a-z
    i >= 48 && i <= 57;        // 0-9
}

var exported_asciiidentifierdatajs = {
  asciiIdentifierStartTable: identifierStartTable,
  asciiIdentifierPartTable: identifierPartTable
};

var exported_asciiidentifierdatajs_asciiIdentifierStartTable = identifierStartTable;
var exported_asciiidentifierdatajs_asciiIdentifierPartTable = identifierPartTable;
export { exported_asciiidentifierdatajs_asciiIdentifierStartTable as asciiIdentifierStartTable, exported_asciiidentifierdatajs_asciiIdentifierPartTable as asciiIdentifierPartTable };
