var GoogleDocFinder = (function() {
  const DRIVE_ID = '';
  const SPREADSHEET_ID = '';
  const RANGE = 'E1:G';

  const matches = {
    NO_MATCH: "no_match",
    MATCH_FOUND: "match_found",
    MULTIPLE_MATCHES: "multiple_matches",
  };

  var googleDocFinder = {};
  googleDocFinder.name = 'GoogleDocFinder';

  googleDocFinder.findAmountAndInvoice = function(invoiceNumber, amount) {
    var matchResult = {
      invoiceNumber: invoiceNumber,
      amount: amount,
    };

    const folder = DriveApp.getFolderById(DRIVE_ID);
    var files = folder.searchFiles(`fullText contains "${invoiceNumber}" and fullText contains "${amount}"`);

    var results = []
    while (files.hasNext()) {
      var file = files.next();
      var fileId = file.getId();
      var fileName = file.getName();
      results.push(`${fileId} - ${fileName}`)
    }
  
    matchResult.results = results;
    switch (results.length) {
      case 1:
        matchResult.outcome = matches.MATCH_FOUND;
        // Logger.log(`MATCH FOUND - ${results[0]}`)
        break;
      case 2:
        matchResult.outcome = matches.MULTIPLE_MATCHES;
      default:
        matchResult.outcome = matches.NO_MATCH;
    }

    return matchResult;
  };

  // This should be a private function
  googleDocFinder.writeResult = function(range, currentCellRow, result) {
    var backgroundColor = "#FFFFFF";
    // Color the background cell of matches
    if (result.outcome == matches.MATCH_FOUND) {
      backgroundColor = "#ccebd4";
    }

    var currentCell = range.getCell(currentCellRow,3);
    currentCell.setValue(result.outcome);
    currentCell.setBackground(backgroundColor);
    Logger.log(`Match invoice: ${result.invoiceNumber} and amount - ${result.amount}: ${result.outcome}`);
  };

  googleDocFinder.runSpreadsheetData = function() {
    var spreadSheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadSheet.getSheetByName('Sheet1');
    var range = sheet.getRange(RANGE);
    var numRows = range.getNumRows();
    var numCols = range.getNumColumns();
    var startRow = range.getRow();
    var startCol = range.getColumn();
    Logger.log('row: ' + startRow);
    Logger.log('col: ' + startCol);
    Logger.log('num row: ' + numRows);
    Logger.log('num col: ' + numCols);

    for (var i = 0; i < 100; i++) {
      var currentCellRow = i+1;
      var invoice = range.getCell(currentCellRow,1).getValue();
      var amount = range.getCell(currentCellRow, 2).getValue();
      if (invoice == "" && amount == "") {
        continue;
      }
      // Do the actual matching
      var result = googleDocFinder.findAmountAndInvoice(invoice, amount);
      googleDocFinder.writeResult(range, currentCellRow, result);
    }
  };
  return googleDocFinder;
})()

function runMatching() {
  /*
  var result = findAmountAndInvoice("105218", "292.60");
  Logger.log(result.message);
  Logger.log(result.results);
  */
  GoogleDocFinder.runSpreadsheetData()
}
