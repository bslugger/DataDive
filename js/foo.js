//the function to filter by zip code
function zipFilter(){
	
	// zipp = $('#blackbox').text();
	zipp = 48104;
	console.log(zipp);
	subDataByZip = [];
	z = [];
	totalAmountZip = 0;
	y = [];

	//iterate through our full dataset to filter by Zip
	for (var i = 0; i < jdata.length; i++) {
		if (jdata[i].Zip === zipp) {
			subDataByZip.push(jdata[i]);
			ID = jdata[i].Grantee_ID;

			inclusionTest(z, ID);

			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			y.push(amt);			
		}
	}

	// the logic to determine aggregated sums by FOI!
	numGrants = subDataByZip.length;
	numOrgs = z.length;
	for (var i = 0; i < y.length; i++) {
		totalAmount = totalAmount + y[i];
	}
	console.log("number of orgs", numOrgs);
	console.log("num of grants", numGrants);
	console.log("total awarded", totalAmount);

};


//create a subset of data by FOI
function foiFilter(){
	foiData = $(this).data('foi');
	console.log('button clicked: ',foiData);
	if (foiData != 'all') {
		$('#foi7').removeClass('hidden');
	} else {
		$('#foi7').addClass('hidden');
		$('#foi6').removeClass('hidden');
	}

	//clear any previous data inside subData and a, which act as our filtered results
	subData = [];
	a = [];
	totalAmount = 0;
	s = [];
	var hash = new Object();
	//iterate through our full dataset to filter by FOI
	for (var i = 0; i < jdata.length; i++) {
		if (jdata[i].Field_aggregate === foiData || foiData == 'all') {
			subData.push(jdata[i]);
			ID = jdata[i].Grantee_ID;

			inclusionTest(s,ID);
			getDollarAmountLight(hash,jdata[i],foiData);
			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			a.push(amt);			
			}
		};
		
	// the logic to determine aggregated sums by FOI!
	numGrants = subData.length;
	numOrgs = s.length;
	for (var i = 0; i < a.length; i++) {
		totalAmount = totalAmount + a[i];
	}
	console.log("number of orgs", numOrgs);
	console.log("num of grants", numGrants);
	console.log("total awarded", totalAmount);

	$("#blackbox").empty().html(function(){
				return '<h2>In <span class="foiColor">' + foiData + '</span>, <br>' 
				+ 'AAACF Impacted: </h2>'
				+ '<h5>Number of Recipients</h5><h1>' + numOrgs
				+ '</h1><h5>Total Number of Grants Awarded</h5><h1>' + numGrants
				+ '</h1><h5>Total Funds Awarded</h5><h1>' + Currency('$',totalAmount) + '</h1>';
			});
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
	//This thing is slowing everything down a lot, and it's essentially doing what
	//the above function already did...there must be some way to combine them. The problem is in getColor()
	// var existingLayer = L.geoJson(null).addTo(map);
	map.removeLayer(existingLayer);

	existingLayer = L.geoJson(data, {
		onEachFeature:onEachFeature,
		style: function(feature) {
			switch (feature.properties.NAME) {
				default: return {color:"black",fillColor:getColorLight(hash,feature.properties.NAME),weight:1,fillOpacity:1}
			}
		}
	
	}).addTo(map);
	
}; //end foi function
		
$( "#slider" ).on( "slidechange", function( event, ui ) {
	map.removeLayer(existingLayer);
	existingLayer = L.geoJson(data, {
	onEachFeature:onEachFeature,
	style: function(feature) {
		switch (feature.properties.NAME) {
			default: return {color:"black",fillColor:getColor(jdata,feature.properties.NAME,foiData),weight:1,fillOpacity:1}
		}
	}
	}).addTo(map);
	// map.spin(false);
});

//Defines what happens when an foi button is clicked.			
$('.foi').on('click', foiFilter);
			
		
	
