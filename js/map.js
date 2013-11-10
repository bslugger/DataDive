$(window).bind("load",function(){

	var map = L.map('map').setView([42.281389, -83.748333], 13);

	geojsonFeature = d3.json('data/zip.json',function(data){
		L.geoJson(data).addTo(map);

		console.log(data);

	L.tileLayer('http://{s}.tile.cloudmade.com/6a7ab36b926b4fc785f8a957814c8685/997/256/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	    maxZoom: 18,
		}).addTo(map);
	});
});