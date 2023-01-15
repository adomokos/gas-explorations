/*
function createDocument() {
  var greeeting = 'Hello world!'

  var doc = DocumentApp.create('Hello_DocumentApp');
  doc.setText(greeeting);
  doc.saveAndClose();
}
*/
/*
function listFiles() {
  var files = DriveApp.searchFiles('fullText contains "105218"');
  while (files.hasNext()) {
    var file = files.next();
    Logger.log(file.getName());
  }
}
*/

/*
function extractTextFromPDF() {
  const folders = DriveApp.getFolderById('1QVo_pxxx387WPH9Yx');
  const newfile = folders.getFilesByName('08-Sep-2021.pdf');
  if(newfile.hasNext()){
    var file1 = newfile.next().getBlob();
  }
  
  const blob = file1;
  const resource = {
    title: blob.getName(),
    mimeType: blob.getContentType()
  };

  // Enable the Advanced Drive API Service
  const file = Drive.Files.insert(resource, blob, {convert: true});

  // Extract Text from PDF file
  const doc = DocumentApp.openById(file.id);
  const text = doc.getBody().getText();
  Logger.log(text);
  const buying = /USD\n(.*?)$/gm.exec(text)[1].trim();
  const selling = /USD\n\s*\S*\n(.*?)$/gm.exec(text)[1].trim();

  console.log(buying) 
  console.log(selling)

  //Remove the converted file.
  DriveApp.getFileById(file.id).setTrashed(true);

}
*/

const DRIVE_ID = '';
const SPREADSHEET_ID = '';
const RANGE = 'E1:G';

var matchResult = {};

function findAmountAndInvoice(invoiceNumber, amount) {
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
}

/*
function readSpreadsheetData() {
  var spreadSheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadSheet.getSheetByName('Sheet1');
  var dataCells = sheet.getRange("E1:G").getValues();
  var cellsWithData = dataCells.filter(function(row) {
    return (row[0] !== "" && row[1] !== "")
  });

  Logger.log(`Number of invoices: ${cellsWithData.length}`);

  cellsWithData.forEach(function(row) {
    var result = findAmountAndInvoice(row[0], row[1]);
    Logger.log(`Trying to find ${row[0]} and ${row[1]} - ${result.message}`);
  });
}
*/

function readSpreadsheetData() {
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
    var result = findAmountAndInvoice(invoice, amount);
    range.getCell(currentCell,3).setValue(result.message);
    Logger.log(`Match invoice: ${invoice} and amount - ${amount}: ${result.message}`);
  }
}

function runMatching() {
  /*
  var result = findAmountAndInvoice("105218", "292.60");
  Logger.log(result.message);
  Logger.log(result.results);
  */
  readSpreadsheetData()
}
