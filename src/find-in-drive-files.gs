var GoogleDocFinder = (function() {
  const DRIVE_ID = '';
  const SPREADSHEET_ID = '';
  const RANGE = 'E1:H';

  const matches = {
    NO_MATCH: "no_match",
    MATCH_FOUND: "match_found",
    MULTIPLE_MATCHES: "multiple_matches",
  };

  var googleDocFinder = {};
  googleDocFinder.name = 'GoogleDocFinder';

  googleDocFinder.collectFolders = function() {
    var rootFolder = DriveApp.getFolderById(DRIVE_ID);
    var folders = [];

    function iterateSubFolders(callingFolder, callingPath) {
      folders.push(callingFolder);
      var callingFolderName = callingFolder.getName();
      var callingFolderFullPath = callingPath + callingFolderName + "/";
      // Logger.log(callingFolderFullPath);

      var childSubFolders = callingFolder.getFolders();
      while (childSubFolders.hasNext()) {
          var nextSubFolder = childSubFolders.next();
          iterateSubFolders(nextSubFolder, callingFolderFullPath);
      }
    }

    iterateSubFolders(rootFolder, "/");

    return folders;
  }

  googleDocFinder.findAmountAndInvoice = function(folder, invoiceNumber, amount) {
    var matchResult = {
      invoiceNumber: invoiceNumber,
      amount: amount,
    };

    var files = folder.searchFiles(`fullText contains "${invoiceNumber}" and fullText contains "${amount}"`);

    var results = []
    while (files.hasNext()) {
      var file = files.next();
      results.push(file)
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
  googleDocFinder.writeResult = function(range, currentCellRow, fileMatches) {
    var backgroundColor = "#FFFFFF";
    var currentCell = range.getCell(currentCellRow,3);
    var fileResultCell = range.getCell(currentCellRow, 4);

    if (fileMatches.length == 1) {
      var fileMatch = fileMatches[0];
      currentCell.setValue(fileMatch.outcome);
      currentCell.setBackground("#CCEDB4");

      fileResultCell.setValue(fileMatch.results);

      var result = fileMatches[0];
      Logger.log(`Match invoice: ${result.invoiceNumber} and amount` +
      `- ${result.amount}: ${result.outcome} - ${result.results}`);

      return;
    }

    if (fileMatches.length > 0) {
        currentCell.setValue('multiple_matches');
        currentCell.setBackground("#FFFDE7");

        var fileNames = fileMatches.map(function(fileMatch) {
          return fileMatch.results[0].getName()
        });
        fileResultCell.setValue(fileNames.toString());

        return;
    }

    currentCell.setValue('no_match');
    currentCell.setBackground(backgroundColor);
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

    // Get all folders with subfolders
    var folders = googleDocFinder.collectFolders();

    for (var i = 0; i < 100; i++) {
      var currentCellRow = i+1;
      var invoice = range.getCell(currentCellRow,1).getValue();
      var amount = range.getCell(currentCellRow, 2).getValue();
      if (invoice == "" && amount == "") {
        continue;
      }

      var fileMatches = [];
      folders.forEach(function(folder) {
        var result = googleDocFinder.findAmountAndInvoice(folder, invoice, amount);
        if ((result.outcome === matches.NO_MATCH) == false) {
          fileMatches.push(result);
          // Logger.log(`---- ${fileMatches}`);
        }
      });

      googleDocFinder.writeResult(range, currentCellRow, fileMatches);
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
  GoogleDocFinder.runSpreadsheetData();
}
