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
// this need to be made into a function ferreal.
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

//end the new function area

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
		
		
function inclusionTest(yourList,dataID){
	//create the logic for inclusion in set to not count duplicates
	if (yourList.indexOf(dataID) > -1) {
		//do nothing
	} else {
		yourList.push(dataID);
	}
	return yourList;
};

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
