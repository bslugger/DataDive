$(window).bind("load",function(){
	//This centers the map on Ann Arbor, MI
	var map = L.map('map').setView([42.281389, -83.748333], 11);
	
	//This loads in the geoJSON data
	geojsonFeature = d3.json('data/zip.json',function(data){
		L.geoJson(data).addTo(map);
	
		//This draws the map itself at a specified position. 
		L.tileLayer('http://{s}.tile.cloudmade.com/6a7ab36b926b4fc785f8a957814c8685/997/256/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			maxZoom: 18,
			}).addTo(map);
			
		//This defines the functions for various interactions with the map
		function onEachFeature(feature, layer) {
				layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: popupContent,
				// pointToLayer: pointToLayer
				});
			}
			
		//This is what happens on click
		function popupContent(){
			console.log("HELLO");
		};
		
		//This is what happens on mouseover
		function highlightFeature(e){
		var layer = e.target;
		var year = 2013;
		var numberOfRecipients = 0;
		var totalNumberOfGrantsAwarded = 0;
		var percentOfYearGrantMoney = 0;
		//Here is where the tooltip message is generated. We need to put the aggregated information in here.
		$("#blackbox").html(function(){
							return '<h1>In ' + year + ', <br>' 
							+ layer.feature.properties.NAME + ' received: </h1>'
							+ '<h3>Number of Recipients</h3>' + numberOfRecipients 
							+ '<h3>Total Number of Grants Awarded</h3>' + totalNumberOfGrantsAwarded
							+ "<h3>% of Year's Grant Money</h3>" + percentOfYearGrantMoney;
						})
					  .css('display','block');
		layer.setStyle({ // highlight the feature
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 1
		});
		
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
		// map.info.update(layer.feature.properties); // Update infobox
		};
		
		//This is what happens after you mouseout
		function resetHighlight(e) {
		
		var layer = e.target;
		$("#blackbox").css('display','none');
		layer.setStyle({ // highlight the feature
			weight: 1,
			dashArray: '',
			color:"white",
			fillColor:'rgb(45,42,43)',
			fillOpacity: 1,
			// border-color: "white";	
		});
		
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
		
		// map.info.update(layer.feature.properties); // Update infobox
		};
		
		//This is where the default colors and style of the map are defined. 
		L.geoJson(data, {
		onEachFeature:onEachFeature,
		style: function(feature) {
			switch (feature.properties.NAME) {
				default: return {color:"white",fillColor:'rgb(45,42,43)',weight:1,fillOpacity:1}
			}
		}
		}).addTo(map);
		
	
	});
});