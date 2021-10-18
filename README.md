# AppScripts
The home for google app scripts I've written to make my life easier in various ways.

To deploy these to work for you, you'll need to put them in your own google app script area - here https://script.google.com/u/0/home

* IsItUp.gs - Check whether the urls in the first column of the only sheet in the spreadsheet called "isitup" are currently returning 200.

* SpotTheStation.gs - Grab NASA's "spot the station" emails and turn them into calendar events then archive them

Triggering of these things is up to you to configure - there are some nice time-based triggers available (like every day between 12pm and 1pm, which is when I run the SpotTheStation one)
