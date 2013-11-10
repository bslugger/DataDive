$(window).bind("load",function(){

	var map = L.map('map').setView([42.281389, -83.748333], 11);

	geojsonFeature = d3.json('data/zip.json',function(data){
		L.geoJson(data).addTo(map);

		console.log(data);
	
	L.tileLayer('http://{s}.tile.cloudmade.com/6a7ab36b926b4fc785f8a957814c8685/997/256/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	    maxZoom: 18,
		}).addTo(map);
	function onEachFeature(feature, layer) {
			layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: popupContent,
            // pointToLayer: pointToLayer
			});
		}
		
	function popupContent(){
		console.log("HELLO");
	};
	function highlightFeature(e) {
	var layer = e.target;
	var div = document.getElementById( 'sideTooltipdiv' );
	div.insertAdjacentHTML('beforeBegin',layer.feature.properties.NAME);
	
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
	function resetHighlight(e) {
	
    var layer = e.target;
	
    layer.setStyle({ // highlight the feature
        weight: 1,
        dashArray: '',
		color:"white",
		fillColor:"black",
        fillOpacity: 1,
		// border-color: "white";	
    });
	
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
	
    // map.info.update(layer.feature.properties); // Update infobox
	};
	x = 5
	y = "red"
	z = "yellow"
	L.geoJson(data, {
	onEachFeature:onEachFeature,
    style: function(feature) {
        switch (feature.properties.NAME) {
            case '48105': return {color: y}
            case '48108': return {color: "white", "weight": x}
			default: return {color:"white",fillColor:"black",weight:1,fillOpacity:1}
        }
    }
	
	}).addTo(map);
	
	
	});
});