var filename = "isitup-src";

function isItUp() {

  var urls = getURLs(filename);

  for (var ii=0; ii < urls.length; ii++) {

    var is_up = isUp(urls[ii]);

    if (!is_up){
      GmailApp.sendEmail(Session.getActiveUser().getEmail(), urls[ii] + " is down", "Thought you ought to know *faints*");
    }

  }
}

function isUp(url) {

  var response = UrlFetchApp.fetch(url);
  
  var return_code = -1;
  var retries = 0;
  
  while (return_code != 200 && retries < 3) {
    Utilities.sleep(1000);
    return_code = response.getResponseCode();
    retries++;
  }

  Logger.log("Return code of " + return_code + " after " + retries + " retries");

  return (return_code == 200);
}

function test_isUp() {
  // Assume google is up
  if (!isUp("http://www.google.com")){
    throw ("Google is down or code is broken");
  }
}

function getURLs(filename) {
  // Get the file
  var files = DriveApp.getFilesByName(filename);

  // Check there was at least one, but no more
  if (files.length == 0) {
    throw ("No files called " + filename + " found");
  } else if (files.length > 1) {
    throw ("Too many files called " + filename + " found");
  }

  // Open the spreadsheet (will exception if not a spreadsheet)
  var source_file = SpreadsheetApp.open(files.next())

  // Source our data (all first row of first sheet)
  var sheet = source_file.getSheets()[0];
  var values = sheet.getRange("A:A").getValues();

  // Flatten our 2D array (with width 1) and remove blanks
  var urls = values.reduce(function(acc, row) {
    return acc.concat(row.filter(function(x) {
      return x != "";
    }));
  }, []);

  return urls;
}

function test_getURLs(){
  // Can't easily delete temp files in google app script (and it's risky) so this file just exists
  var ss_name = "isitup-test_getURLs";
  var test_data = ["x", "y", "z"];
  var result = getURLs(ss_name);
  var success = true;
  if (result.length != test_data.length){
    success = false;
  }
  for (var ii = 0; ii < result.length; ii++){
    if (result[ii] != test_data[ii]){
      success = false;
    }
  }
  if (!success){
    throw("Code is broken");
  }
}