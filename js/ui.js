//this is where the slider functionality is defined. here is some info for how it was created. http://jqueryui.com/slider/#steps
$(function() {
		
		$( "#slider" ).slider({
		  value:2013,
		  min: 1990,
		  max: 2013,
		  step: 1,
		  slide: function( event, ui ) {
			$( "#year" ).val( ui.value );
		  }
		});
		$( "#year" ).val( $( "#slider" ).slider( "value" ) );
	  });
//This is a function to make dollar amounts look nice.	  
function Currency(sSymbol, vValue) {
  aDigits = vValue.toFixed().split(".");
  aDigits[0] = aDigits[0].split("").reverse().join("").replace(/(\d{3})(?=\d)/g,   "$1,").split("").reverse().join("");
  return sSymbol + aDigits.join(".");
}
//way of parsing year out of effective_date
function parseDate(dateString){
	dateStringLength = dateString.length;
	return dateString.slice(dateStringLength - 4, dateStringLength);
}	
//parse ZIPs
function parseZIP(zip){
	return zip.slice(0,5);
}	
//Generates a table for the bottom tooltip. Needs to be passed the layer, and a dataset of some kind.
function printOrgs(layer,jdata,foiData){
			var listOfOrgs = "<table id= 'orgTable'><tr><td>Grantee ID</td><td>Grant Amount</td><td>Field of Interest</td></tr>";
			for (var i = 0; i < jdata.length; i++) {
				// filter out what is displayed in the bottom pop-up by FOI and Zip Code. Also, year right now, but that can be changed.
				if(parseZIP(jdata[i].Zip) === layer.feature.properties.NAME && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
					listOfOrgs += "<tr><td>" + jdata[i].Grantee_ID + "</td><td>" + Currency('$',jdata[i].Amount) + "</td>";
					listOfOrgs += "<td>" + jdata[i].Field_aggregate + "</td><tr>"
				}
			}
			return listOfOrgs + "</table>";
		}
function inclusionTest(yourList,dataID){
	//create the logic for inclusion in set to not count duplicates
	if (yourList.indexOf(dataID) > -1) {
		//do nothing
	} else {
		yourList.push(dataID);
	}
	return yourList;
};
function getColor(jdata,zip,foiData){
	
	 var d = getDollarAmounts(jdata,zip,foiData);
	 return d > 100000 ? 'rgb(2,56,88)' :
	   d > 80000   ? 'rgb(4,90,141)' :
	   d > 60000   ? 'rgb(5,112,176)' :
	   d > 40000  ? 'rgb(54,144,192)' :
	   d > 20000   ? 'rgb(116,169,207)' :
	   d > 0       ? 'rgb(166,189,219)' :
					 'grey';
	  
}
function getColorLight(hash,zip){
	 if(hash[zip]){
		d = hash[zip];
	 }
	 else{
		return 'grey';
	 }
	 return d > 100000 ? 'rgb(2,56,88)' :
	   d > 80000   ? 'rgb(4,90,141)' :
	   d > 60000   ? 'rgb(5,112,176)' :
	   d > 40000  ? 'rgb(54,144,192)' :
	   d > 20000   ? 'rgb(116,169,207)' :
	   d > 0       ? 'rgb(166,189,219)' :
					 'grey';
}	  
//by zip, by year, (by foi,depending) to obtain number of grants, dollar amount of grants, number of recipients
function getDollarAmounts(jdata,zip,foiData){
	subDataByZip = [];
	z = [];
	totalAmountZip = 0;
	y = [];
	for (var i = 0; i < jdata.length; i++){
		if(jdata[i].Zip === zip && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
			subDataByZip.push(jdata[i]);
			ID = jdata[i].Grantee_ID;
			
			inclusionTest(z, ID);
			
			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			y.push(amt);
		}
		}
		numGrants = subDataByZip.length;
		numOrgs = z.length;
		for (var i = 0; i < y.length; i++) {
				totalAmountZip += y[i];
		}
	return totalAmountZip;
}
//slightly faster way of getting dollar amounts, need to fix ZIP code
//discrepancy.
function getDollarAmountLight(hash,datum,foiData){
		if((datum.Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(datum.Effective_Date)){
			
			if (hash[datum.Zip]){
				hash[datum.Zip] += datum.Amount;
			}
			else{
				hash[datum.Zip] = datum.Amount;
			}
		}
		parseZIP(datum.Zip);
}
//end beta get dollars
function getFilteredArrayByZip(layer,jdata,foiData){
	subDataByZip = [];
	z = [];
	totalAmountZip = 0;
	y = [];
	for (var i = 0; i < jdata.length; i++){
		if(parseZIP(jdata[i].Zip) === layer.feature.properties.NAME && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
			subDataByZip.push(jdata[i]);
			ID = jdata[i].Grantee_ID;
			
			inclusionTest(z, ID);
			
			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			y.push(amt);
		}
		}
		numGrants = subDataByZip.length;
		numOrgs = z.length;
		for (var i = 0; i < y.length; i++) {
				totalAmountZip += y[i];
		}
	return [numOrgs,numGrants,totalAmountZip];
}


//Things that ought to be done
//Figure out exactly how the bottom tooltip should display

//Roll up data in bottom tooltip??


//Also, there are some bugs related to the filters. I will go into detail later, 
//but just play around and you should be able to replicate it.

//Also, things move a little slow. There needs to be some way of speeding
//up the load time following button pushes and what-not.

//Add legend with color coding, maybe.

//things that might be nice to have
//Way of hitting a play button to show change through the years, like in the Karnataka map.
//Get the Grantee names
//Do breakdown by percent of total for grants awarded

//How hard would it be to run some kind of loading indicator?



