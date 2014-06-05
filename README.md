# DataDive
========
This repository is the code for the interactive visualization created for the AAACF the Fall 2013 A2DataDive.

This map is powered by MapBox and LeafletJS.

============================================================

## ADDITIONAL INFORMATION ABOUT HOW THIS WAS CREATED AND HOW IT WORKS

### Interactive Dashboard

We created a visualization of the AAACF’s data aggregated into key key categories over time. The code we used to create the visualization is all in the following Github repository: https://github.com/akosel/DataDive

You can also see a demo of the site at http://aaronkosel.com/datadive/ for now, at least until the AAACF gets it up and running on their site. 

If you want to run it on your local machine, and have python, you can pretty easily play around with it. 

Just go to the folder with the index.html file using your command line
At your command line type, python -m SimpleHTTPServer 8000 (at least for Windows this works). 
Then open up your web browser, and type localhost:8000. Everything should load up quite nicely, and you can play around with stuff. 

## Data Preparation

### AAACF Data
1. Aggregate master_data by important field of interests 
2. Take raw data file in Excel
3. Using the field_aggregation_key.xlsx, use Excel VLOOKUP function to change ________________
4. Convert aggregated csv to json using http://www.convertcsv.com/csv-to-json.htm (either copy and paste or Choose File from your computer)
5. Saved this file as aaacfData.json

### ZIP Data
1. Get ZIP code shape file from census website: ftp://ftp2.census.gov/geo/tiger/TIGER2013/ZCTA5/. (it’s a big file, 500 mb, so don’t worry about it, unless you really want to.)
2. Filtered out all non-Michigan ZIP codes using R (Mike Shvartsman did this)
3. Convert shapefile to geoJSON
4. Went to http://shpescape.com/, click geoJSON/topoJSON option. 
5. Click choose file
6. Attach ZIP folder with Michigan Zip code shapes

That’s it. You have it.
Saved geoJSON as zip.json

## Connecting the data with the front-end

Each of the data files is loaded in turn in the map.js file
The zip.json data is used in conjunction with the map to draw shapes correctly, it is called ‘data’
The aaacfData.json data is used to assign values to the different zip code shapes within the map. It is called jdata. We used leaflet.js, there site has some pretty good documentation about how to do this: http://leafletjs.com.

Transforming the data in the UI (this is just a list, the order is not important)

foiFilter() in map.js rolls up data based on what field of interest button was clicked. This is actived on the click of any foi classed element
getDollarAmounts(jdata,zip,foiData) in ui.js rolls data up by field of interest and ZIP code. foiData stores the value of what foi is currently selected, if any, and zip stores a particular zip code. Should be noted that ZIP code is parsed so that any -XXXX stuff at the end is not considered on the aggregate.
getFilteredArrayByZip(layer,jdata,foiData) in ui.js rolls up the data based on the foi currently selected and the ZIP code that is currently being hovered over and updates the side tooltip. This returns an array of key information about said zip code. 
printOrgs(layer,jdata,foiData) gives a list of data for a ZIP code that was clicked on, and generates a list at the bottom of the screen with info about each individual grant that makes up the aggregate.


