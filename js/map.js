$(window).bind("load",function(){
	//This centers the map on Ann Arbor, MI
	var map = L.map('map').setView([42.2, -83.748333], 9);
	
	//This loads in the geoJSON data
	d3.json('data/zip.json',function(data){
		//Start Edgar's Code-----------------------------------------------------------------------------
		$.getJSON("data/aaacfData.json", callbackFunction);
		//This is used to color the map in map.js. Seems to have to be called
		//inside of this function, but it may not...weird.
		function callbackFunction(jdata){
			
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
			});
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
					$('#foi7').removeClass('hidden');
				} else {
					$('#foi7').addClass('hidden');
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

	//Defines what happens when an foi button is clicked.
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
			//end Edgar's Code------------------------------------------------------------------

			L.geoJson(data).addTo(map);
		
			//This draws the map itself at a specified position. Also that long alphanumeric string is the API key. This may need
			//to be changed at some point
			L.tileLayer('http://{s}.tile.cloudmade.com/6a7ab36b926b4fc785f8a957814c8685/997/256/{z}/{x}/{y}.png', {
				//I don't really like the attribution in the corner, but I am not sure if its necessary. Let's leave it out for now...
				// attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 18
			}).addTo(map);
				
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
				$("#blackbox").html('<h2>Over 60 years<br> \
									the Ann Arbor Area received: </h2> \
								<h5>Number of Recipients</h5> \
								<h1>450</h1> \
								<h5>Total Number of Grants Awarded</h5> \
								<h1>2048</h1> \
								<h5>Total Funds Awarded</h5> \
								<h1>$11,636,423</h1>	');
				$('#sideTooltipdivWrapper').css("background-color", '#a4045e');
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
			
			//This is where the default colors and style of the map are defined. Existing layer variable is generated
			//so that it can be removed later to remove layers piling up, as it were.
			existingLayer = L.geoJson(data, {
					onEachFeature:onEachFeature,
					style: function(feature) {
						switch (feature.properties.NAME) {
							default: return {color:"black",fillColor:getColor(jdata,feature.properties.NAME,foiData),weight:1,fillOpacity:1}
						}
					}
			}).addTo(map);
			
		}
	});
});