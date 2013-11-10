$(window).bind("load",function(){
	//This centers the map on Ann Arbor, MI
	var map = L.map('map').setView([42.281389, -83.748333], 11);
	
	//This loads in the geoJSON data
	geojsonFeature = d3.json('data/zip.json',function(data){
		//Start Edgar's Code-----------------------------------------------------------------------------

		
		//getting our json data
		$.getJSON("data/aaacfData.json", function(grantData){
			jdata = grantData;
			return jdata;
		});
		

		function inclusionTest(yourList,dataID){
			//create the logic for inclusion in set to not count duplicates
			if (yourList.indexOf(dataID) > -1) {
				//do nothing
			} else {
				yourList.push(dataID);
			}
			return yourList;
		};

		//create a subset of data by FOI
		var foiData = 'all';
		var zipData;
		var yearData = 'all';
		var subData = [];
		var totalAmount = 0;
		var numOrgs;
		var s = []; // list that will be used to check for foi inclusion
		var numGrants;
		var a = []; // list that will be used to calculate total amount by FOI

		function foiFilter(){
			foiData = $(this).data('foi');
			console.log('button clicked: ',foiData);
			if (foiData != 'all') {
				$('#foi6').removeClass('hidden');
			} else {
				$('#foi6').addClass('hidden');
			}

			//clear any previous data inside subData and a, which act as our filtered results
			subData = [];
			a = [];
			totalAmount = 0;
			s = [];

			//iterate through our full dataset to filter by FOI
			for (var i = 0; i < jdata.length; i++) {
				if (jdata[i].Field_aggregate === foiData) {
					subData.push(jdata[i]);
					ID = jdata[i].Grantee_ID;

					inclusionTest(s,ID);

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
		}; //end foi function


		$('.foi').on('click', foiFilter);

		var zipp;
		subDataByZip = [];
		z = []; // list used to check for org ID inclusion by zip
		totalAmountZip = 0;
		y = []; // list used to hold total amount of grant money by zip


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

		// zipFilter();
		//end Edgar's Code------------------------------------------------------------------

		// $('.zip').on('hover', zipfilter);		
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
		function popupContent(e){
			layer = e.target;
			$("#orgList").html(function(){
							console.log(jdata);
							return '<h1>Organizations Awarded Grants<h1>';
						})
					  .css('display','block');
		};
		
		//This is what happens on mouseover
		function highlightFeature(e){
		var layer = e.target;
		var year = $('#slider').slider('option','value');
		var numberOfRecipients = 0;
		var totalNumberOfGrantsAwarded = 0;
		var percentOfYearGrantMoney = 0;
		//Here is where the tooltip message is generated. We need to put the aggregated information in here.
		$("#blackbox").empty().html(function(){
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