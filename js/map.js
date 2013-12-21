var data = {};
var jdata = {};
loadData = function(){
	map.spin(true);
	$.when(	
		$.getJSON("data/zip.json",function(json){
			data = json;
			console.log(data);
		}),
		$.getJSON("data/aaacfData.json",function(json){
			jdata = json;
			console.log(jdata);
		})
	)
	.done(
		function(){createLayer();map.spin(false);}
	)
} //end of data loading function

//This draws the map itself at a specified position. Also that long alphanumeric string is the API key. This may need
	//to be changed at some point
cloudmade = new L.tileLayer('http://{s}.tile.cloudmade.com/6a7ab36b926b4fc785f8a957814c8685/{styleID}/256/{z}/{x}/{y}.png', {
	maxZoom: 10,
	//this defines the style of the underlying map. Different styles can be found here http://maps.cloudmade.com/editor#
	styleID:59866
})
//This centers the map on Ann Arbor, MI
var map = L.map('map',{
    layers: [cloudmade],
    center: new L.LatLng(42.2, -83.748333),
    zoom: 9,
    // Tell the map to use a loading control
    loadingControl: true
});

//This defines the functions for various interactions with the map
function onEachFeature(feature, layer) {
	layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	click: popupContent
	});
}

//This is what happens on click
function popupContent(e){
	var layer = e.target;
	var year = $('#slider').slider('option','value');
	var zip = layer.feature.properties.NAME;
	$("#orgList").html(function(){
					return '<h1>Organizations in ' + zip + ' Awarded Grants (' +
					year + ')<h1>' + 
					printOrgs(layer,jdata,foiData);
				})
			  .css('display','block')
			  .css('height','auto');
	
	var newTableObject = document.getElementById('orgTable');
	sorttable.makeSortable(newTableObject);
};

//This is what happens on mouseover
function highlightFeature(e){
	var layer = e.target;
	var year = $('#slider').slider('option','value');
	var zip = layer.feature.properties.NAME;
	var keyZipInfo = getFilteredArrayByZip(layer,jdata,foiData);
	//Here is where the tooltip message is generated. We need to put the aggregated information in here.
	$("#blackbox").empty().html(function(){
						return '<h2>In ' + year + ', <br>' 
						+ zip + ' received: </h2>'
						+ '<h5>Number of Recipients</h5><h1>' + keyZipInfo[0]
						+ '</h1><h5>Total Number of Grants Awarded</h5><h1>' + keyZipInfo[1]
						+ "</h1><h5>Total Funds Awarded</h5><h1>" + Currency('$',keyZipInfo[2]) + '</h1>';
					});
	layer.setStyle({ // highlight the feature
		weight: 5,
		// fillColor: 'white',
		dashArray: '',
		fillOpacity: .3
	});
	
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	// map.info.update(layer.feature.properties); // Update infobox
};

//This is what happens after you mouseout
function resetHighlight(e) {

	var layer = e.target;
	if(foiData == "all"){
		$("#blackbox").html('<h2>Over 60 years<br> \
					the Ann Arbor Area received: </h2> \
				<h5>Number of Recipients</h5> \
				<h1>450</h1> \
				<h5>Total Number of Grants Awarded</h5> \
				<h1>2048</h1> \
				<h5>Total Funds Awarded</h5> \
				<h1>$11,636,423</h1>	');
	}
	else{
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


	}	
	
		if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	
	layer.setStyle({ // highlight the feature
		weight: 1,
		color: "black",
		fillOpacity: 1,
		fillColor:getColor(jdata,layer.feature.properties.NAME,foiData)
	});
	// map.info.update(layer.feature.properties); // Update infobox
};

//this is used to initialize the first layer	
createLayer = function(){	
	console.log(jdata);
	foiData = 'all'
	existingLayer = L.geoJson(data, {
		onEachFeature:onEachFeature,
		style: function(feature) {
			switch (feature.properties.NAME) {
				default: return {color:"black",fillColor:getColor(jdata,feature.properties.NAME,foiData),weight:1,fillOpacity:1}
			}
		}
	}).addTo(map);
} //end of layer builder	
				
$(document).ready(function(){	
	$.when(
		loadData()
	)
	.done(
		function(){console.log('all done')}
	)
	$('.foi').click(foiFilter);
})	

