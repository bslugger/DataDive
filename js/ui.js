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
			//clean up before making new layer, if it exists.
			if(typeof(existingLayer) != "undefined"){	
				map.removeLayer(existingLayer);
			}
			if(!jQuery.isEmptyObject(data)){	
				createLayer();
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

getColor = function(jdata,zip,foiData) {
	 var d = getDollarAmounts(jdata,zip,foiData);
	// console.log(zip);
	 return d > 100000 ? 'rgb(2,56,88)' :
	   d > 80000   ? 'rgb(4,90,141)' :
	   d > 60000   ? 'rgb(5,112,176)' :
	   d > 40000  ? 'rgb(54,144,192)' :
	   d > 20000   ? 'rgb(116,169,207)' :
	   d > 0       ? 'rgb(166,189,219)' :
					 'grey';
	  
}

getColorLight = function(hash,zip) {
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

blackboxSetter = function() { 
	if(foiData == "all"){
		$("#blackbox").html('<h2>Since 1990<br> \
					the Ann Arbor Area received: </h2> \
				<h5>Number of Recipients</h5> \
				<h1>450</h1> \
				<h5>Total Number of Grants Awarded</h5> \
				<h1>2048</h1> \
				<h5>Total Funds Awarded</h5> \
				<h1>$11,636,423</h1>	');
	} else{
		//this message could be fixed to something like "Key Statistics on <insert grant foi here>" or something liek that. To dry?
		$("#blackbox").empty().html(function(){
			return '<h2>Since 1990, with <span class="foiColor">' + foiData + '</span> grants' 
			+ ' the AAACF Impacted: </h2>'
			+ '<h5>Number of Recipients</h5><h1>' + numOrgs
			+ '</h1><h5>Total Number of Grants Awarded</h5><h1>' + numGrants
			+ '</h1><h5>Total Funds Awarded</h5><h1>' + Currency('$',totalAmount) + '</h1>';
		});
			
	}	
	setFoiColor();

} //end blackbox setter

setFoiColor = function() {
	var bgcolor = '#a4045e';
		if (foiData === 'Arts and Culture') {
			bgcolor = '#BCD1E7';
		} else if (foiData === 'Environment') {
			bgcolor = '#F7C496';		
		} else if (foiData === 'Health and Human Services') {
			bgcolor = '#97BE01';		
		} else if (foiData === 'Youth and Education') {
			bgcolor = '#E47668';		
		} else if (foiData === 'Seniors') {
			bgcolor = '#1A2E5A';		
		} else if (foiData === 'Other') {
			bgcolor = '#E6E551';
		} else {
			bgcolor = '#a4045e';
		}
		
		$('#sideTooltipdivWrapper').css("background-color",bgcolor);
		$('.foiColor').css('color', bgcolor);
}

toggleFilter = function() {

	console.log('button clicked: ',foiData);

	if (foiData != 'all') {
		$('#foi7').removeClass('hidden');
	} else {
		$('#foi7').addClass('hidden');
		$('#foi6').removeClass('hidden');
	}

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
