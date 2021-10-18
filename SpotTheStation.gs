var this_year = new Date().getFullYear();
var month_lookup = {
  "Jan" : "January",
  "Feb" : "February",
  "Mar" : "March",
  "Apr" : "April",
  "May" : "May",
  "Jun" : "June",
  "Jul" : "July",
  "Aug" : "August",
  "Sep" : "September",
  "Oct" : "October",
  "Nov" : "November",
  "Dec" : "December"
}
var email_reg_exp = new RegExp("Time:\\s([^,]*),\\sVisible:\\s([0-9]*)\\smin,\\s(.*)");

var time_reg_exp = new RegExp("[A-Za-z]+\\s([A-Za-z]+)\\s([0-9]+)\\s([0-9]+):([0-9]+)\\s([A-Z]+)");

function stringToDate(time_string, offset) {

  var offset_num = parseInt(offset);

  var time_list = time_reg_exp.exec(time_string);

  Logger.log(time_string);
  Logger.log(time_list);

  var short_month = time_list[1];
  var month = month_lookup[short_month];

  var day = time_list[2];

  var hour_num = parseInt(time_list[3]);
  if (time_list[5] == "PM" && hour_num != 12) {
    hour_num = hour_num + 12;
  }
  hour = Utilities.formatString("%02d", hour_num.toString());

  var minutes = time_list[4];

  var timezone = CalendarApp.getDefaultCalendar().getTimeZone();

  var timezone = Utilities.formatDate(new Date(), timezone, "Z");

  Logger.log(timezone);

  var start_time = month + " " + 
                    day + ", " +
                    this_year + " " +
                    hour_num + ":" + minutes + ":00 " + timezone;

  var minutes_num = parseInt(minutes) + offset_num;
  if (minutes_num >= 60){
    minutes_num = minutes_num - 60;
    hour_num = hour_num + 1;
  }
  hour = Utilities.formatString("%02d", hour_num.toString());
  minutes = Utilities.formatString("%02d", minutes_num.toString());
  
  // Failure to continue carrying means this will fail horribly on midnight

  var end_time = month + " " + 
                  day + ", " +
                  this_year + " " +
                  hour + ":" + minutes + ":00 " + timezone;

  Logger.log("Start time: " + start_time);
  Logger.log("End time: " + end_time);

  return [new Date(start_time), new Date(end_time)];
}

function main() {
  var new_events = [];

  var all_inbox_list = GmailApp.getInboxThreads()
  for (var ii = 0; ii < all_inbox_list.length; ii++){
    var thread = all_inbox_list[ii];
    if (thread.getFirstMessageSubject() == "SpotTheStation"){
      all_messages = thread.getMessages();
      for (var jj = 0; jj < all_messages.length; jj++){
        var message = all_messages[jj];
        Logger.log(message);
        message_text = message.getPlainBody();
        var message_segments = message_text.split("\n");
        message_text = message_segments[0] + message_segments[1];
        var regex_result = email_reg_exp.exec(message_text);
        Logger.log(message_text);
        Logger.log(regex_result);
        new_events.push([regex_result[1], regex_result[2], regex_result[3], thread]);
        Logger.log("These are regex results 1-3:");
        Logger.log(regex_result[1]);
        Logger.log(regex_result[2]);
        Logger.log(regex_result[3]);
      }
    }
  }
  
  var time, length, deets, thread;
  var start_time, end_time;

  for (var ii = 0; ii < new_events.length; ii++){

    Logger.log(new_events[ii]);

    [time, length, deets, thread] = new_events[ii];

    Logger.log(time);

    [start_time, end_time] = stringToDate(time, length)

    var event = CalendarApp.getDefaultCalendar().createEvent('ISS going over',
    start_time,
    end_time);
  
    event.setDescription(deets);

    thread.moveToArchive();

  }
}
