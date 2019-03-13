# Film Location Client

## Start up
> For the client to work correctly, the api server needs to be running, see the server/README.md for details

To start the client, navigate to the client folder and run:
```
npm i
npm start
```
Once running, visit http://localhost:23456 in your browser

# The App
On the left you should see a long list of movies. If you click the movie, hopefully the map on the right will display the location(s) the movie was filmed at. As you scroll, the map will stay with you.

# Notes on the Data Set
I worked with the downloadable CSV file from the website. The file needed a fair amount of normalizing, fixes for bad line breaks, and commas embedded inside block quotes. I managed to create a geoJSON file for quite a few of the given locations, but only about 50% (some movies had no locations, or were too vauge to derive coordinates)