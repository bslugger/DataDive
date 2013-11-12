//this is where the slider functionality is defined. here is some info for how it was created. http://jqueryui.com/slider/#steps

$(function() {
		$( "#slider" ).slider({
		  value:2013,
		  min: 1990,
		  max: 2013,
		  step: 1,
		  slide: function( event, ui ) {
			$( "#year" ).val( ui.value );
			console.log(ui.value);
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
//Generates a table for the bottom tooltip. Needs to be passed the layer, and a dataset of some kind.
function printOrgs(layer,jdata,foiData){
			var listOfOrgs = "<table id= 'orgTable'><tr><td>Grantee ID</td><td>Grant Amount</td><td>Field of Interest</td></tr>";
			for (var i = 0; i < jdata.length; i++) {
				// filter out what is displayed in the bottom pop-up by FOI and Zip Code. Also, year right now, but that can be changed.
				if(jdata[i].Zip === layer.feature.properties.NAME && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
					listOfOrgs += "<tr><td>" + jdata[i].Grantee_ID + "</td><td>" + Currency('$',jdata[i].Amount) + "</td>";
					listOfOrgs += "<td>" + jdata[i].Field_aggregate + "</td><tr>"
				}
			}
			return listOfOrgs + "</table>";
		}
//by zip, by year, (by foi,depending) to obtain number of grants, dollar amount of grants, number of recipients
function numberOfGrants(layer,jdata,foiData){
	

}
//way of parsing year out of effective_date
function parseDate(dateString){
	dateStringLength = dateString.length;
	return dateString.slice(dateStringLength - 4, dateStringLength);
}		
//Needed functions
//color map by above function aggregates for ZIPs
