//this is where the slider functionality is defined. here is some info for how it was created. http://jqueryui.com/slider/#steps
$(function() {	
	$( "#slider" ).slider({
	  value:2013,
	  min: 1990,
	  max: 2013,
	  step: 1,
	  slide: function( event, ui ) {
		$( "#year" ).html( ui.value );
	  },
	 });
	$( "#year" ).html( $( "#slider" ).slider( "value" ) );

	$('#slider').slider().bind({
		 
		slidechange: function( event, ui ) {

			if(typeof(existingLayer) != "undefined"){	
				map.removeLayer(existingLayer);
			}
			if(!jQuery.isEmptyObject(data)){	
				existingLayer = L.geoJson(data, {
				onEachFeature:onEachFeature,
				style: function(feature) {
					switch (feature.properties.NAME) {
						default: return {color:"black",fillColor:getColor(jdata,feature.properties.NAME,foiData),weight:1,fillOpacity:1}
					}
				}
				}).addTo(map);
				// map.spin(false);
			}
		}

	}); //end slidechange definition

});//end slider declaration

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



//***Things that ought to be done***
//Figure out exactly how the bottom tooltip should display

//Roll up  bottom tooltip??

//Add legend with color coding, maybe.

//***things that nice to have***
//Way of hitting a play button to show change through the years, like in the Karnataka map.
//Get the Grantee names
//Do breakdown by percent of total for grants awarded
//either 2 sliders to set  upper year bounds (I.E. 1990-1995) or one slider with two bounds


//maybe use a modal thing, like in Bootstrap to show grantee info, rather than that bottom tooltip...less scolling.

