var data = {};
var jdata = {};
var sData = [];

//This draws the map itself at a specified position. Also that long alphanumeric string is the API key. This may need
//to be changed at some point
var mapbox = new L.tileLayer('https://{s}.tiles.mapbox.com/v3/akosel.i5522e6e/{z}/{x}/{y}.png', {
    maxZoom: 10,
});
//This centers the map on Ann Arbor, MI
var map = L.map('map',{
    layers: [mapbox],
    center: new L.LatLng(42.2, -83.748333),
    zoom: 9
});

// load the data
loadData = function(){
    d = $.Deferred();
    map.spin(true);
	$.when(	
		$.getJSON("data/zip.json",function(json){
			data = json;
		}),
		$.getJSON("data/aaacfData.json",function(json){
			jdata = json;
		})					
	)
	.done(
		function(){ createLayer();},
		function(){ addChart(); map.spin(false); d.resolve(); }
	)
    return d.promise();
} //end of data loading function

//This defines the functions for various interactions with the map
onEachFeature = function(feature, layer) {
	layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	click: popupContent
	});
}

//This is what happens on click
popupContent = function(e) {

	$('#myModal').modal('toggle');

	var layer = e.target;
	var year = $('#slider').slider('option','value');
	var zip = layer.feature.properties.NAME;
	
	$("#myModalLabel").html(function(){
			return '<h1>Organizations in ' + zip + ' Awarded Grants (' + year + ')<h1>'
		})
	$(".modal-body").html(function(){
			return printOrgs(layer,jdata,foiData);
		})
			  .css('display','block')
			  .css('height','auto');
//this allows the table in the bottom tooltip to be sortable..	
	var newTableObject = document.getElementById('orgTable');
	sorttable.makeSortable(newTableObject);
};

//This is what happens on mouseover
highlightFeature = function(e) {
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
}

//This is what happens after you mouseout
resetHighlight = function(e) {

	var layer = e.target;

	blackboxSetter();	

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
//this is important, because the first layer won't be created otherwise.
	if (typeof(foiData) == "undefined"){
		foiData = 'all'
	}
	if (typeof(existingLayer) != "undefined"){
		console.log('removing layer');
		map.removeLayer(existingLayer);
	}	
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

