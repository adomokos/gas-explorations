var GoogleDocFinder = (function() {
  const DRIVE_ID = '';
  const SPREADSHEET_ID = '';
  const RANGE = '';

  var googleDocFinder = {};
  googleDocFinder.name = 'GoogleDocFinder';

  googleDocFinder.findAmountAndInvoice = function(invoiceNumber, amount) {
    var matchResult = {};

    const folder = DriveApp.getFolderById(DRIVE_ID);
    var files = folder.searchFiles(`fullText contains "${invoiceNumber}" and fullText contains "${amount}"`);

    var results = []
    while (files.hasNext()) {
      var file = files.next();
      var fileId = file.getId();
      var fileName = file.getName();
      results.push(`${fileId} - ${fileName}`)

    }
    if(results.length == 0) {
      matchResult.message = 'No match found';
      matchResult.results = results;
      // Logger.log('No match found')
      return matchResult;
    }
    if (results.length == 1) {
      matchResult.message = 'MATCH FOUND';
      matchResult.results = results;
      // Logger.log(`MATCH FOUND - ${results[0]}`)
      return matchResult;
    }
    else {
      matchResult.message = "More than 1 result found";
      matchResult.results = results;
      // Logger.log(`More than 1 result found: ${results}`)
      return matchResult;
    }
  };

  googleDocFinder.readSpreadsheetData = function() {
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
      var currentCell = i+1;
      var invoice = range.getCell(currentCell,1).getValue();
      var amount = range.getCell(currentCell, 2).getValue();
      if (invoice == "" && amount == "") {
        continue;
      }
      // Do the actual matching
      var result = googleDocFinder.findAmountAndInvoice(invoice, amount);
      range.getCell(currentCell,3).setValue(result.message);
      Logger.log(`Match invoice: ${invoice} and amount - ${amount}: ${result.message}`);
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
  GoogleDocFinder.readSpreadsheetData()
}
