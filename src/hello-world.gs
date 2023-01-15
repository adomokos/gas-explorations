// Initial script learning to use GAS
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
  const folders = DriveApp.getFolderById('');
  const newfile = folders.getFilesByName('');
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



/*
function readSpreadsheetData() {
  var spreadSheet = SpreadsheetApp.openById('');
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
