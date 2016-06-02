//this function maps data into a key/value structure
sorted = function() {
	format = d3.time.format('%m/%d/%Y');

	sData = _.map(jdata,function(obj,index){
		return {"key":obj['Field_aggregate'],
			"values":[
				format.parse(obj['Effective_Date']).getFullYear(),
				obj['Amount']
			]};
			})
			.sort(function(a,b){
				return a['values'][0] - b['values'][0];
			});
};

//group the sorted data, this could be removed or something...
groupedSorted = function(){
	sData = _.groupBy(sData,'key');
};

//need the dates to be rolled up into something specific, like years, for example
uniformizeYears = function(){
	sData = _.map(sData,function(value,key){
		return {'key':key,'values':value};
	});

	for (var obj in sData){
		temp=[];
		for(var val in sData[obj]['values']){
		//transform ms here. makes years uniform	
			
			yearMs = getYearMs(sData[obj]['values'][val]['values'][0]);
			sData[obj]['values'][val]['values'][0] = yearMs;
			temp.push(sData[obj]['values'][val]['values']);
		}
		sData[obj]['values'] = temp;

	}
};

//This will be used to aggregate year giving data together.
//TODO: Nothing essential, but one annoying issue with the x-axis. Something is weird here with rounding and leap years and what not.
// could just reduce the number of ticks for the x-axis, potentially. 
getYearMs = function(year) {
	return new Date(year,0,1).getTime();
};

// return a list of unique years throughout the dataset.
getYears = function(){
	var allYears = [];
	_.each(sData, function(value,key){
		temp = [];
		_.each(value.values, function(value2,key2){
			temp.push(value2[0]);
		});
		allYears = _.union(allYears,temp);
	});
	return allYears.sort(function(a,b){return a - b;});
};

clusterYears = function(){
	y = getYears();
	_.each(sData, function(value,key){
		temp = [];
		cluster = _.groupBy(value.values, function(value2,key2){return value2[0];});
		_.each(cluster, function(value3,yearMs){
			
			yearTotal = _.reduce(value3, function(total, amt) {
				return total + amt[1];
			},0);
			temp.push([parseInt(yearMs, 10),yearTotal]);
		});

		//fill in blanks here
		addBlankYears(temp);
		//update array values with aggregated values
		sData[key].values = temp;
	});
};

addBlankYears = function(array){
//cycle through years serially, finding missing years, and adding them
	if(array.length < y.length){
		for (var year in y){
			if (typeof(array[year]) == 'undefined' || array[year][0] !=  y[year] ){
				array.splice(year,0,[y[year],0]);
			}
		}
	}
};

setChartColor = function(d){
	if (d.key === 'Arts and Culture') {
		return '#BCD1E7';
	} else if (d.key === 'Environment') {
		return '#F7C496';
	} else if (d.key === 'Health and Human Services') {
		return '#97BE01';
	} else if (d.key === 'Youth and Education') {
		return '#E47668';
	} else if (d.key === 'Seniors') {
		return '#1A2E5A';
	} else if (d.key === 'Other') {
		return '#E6E551';
	} else {
		return '#a4045e';
	}
};

//Group all of the data transformers into one function
slice = function() {
	sorted();
	groupedSorted();
	uniformizeYears();
	clusterYears();
};

addChart = function(){
	format = d3.time.format('%m/%d/%Y');
	//call the data slicing functions. This admittedly, is weird...I think if I had more time I would do it differently, but yea...
	slice();
	nv.addGraph(function() {
		var chart = nv.models.stackedAreaChart()
				.x(function(d){ return d[0]; })
				.y(function(d){ return d[1]; })
				.color(function(d){return setChartColor(d);}) //super hacky, but I don't known any other way.
				.clipEdge(true)
				.tooltipContent(function(key,x,y,e,graph){
					return '<h1>' + x +  '</h1>'+
						'<h1>' + y + '</h1>' +
						'<h2>' + key + '</h2>';
				});

		chart.xAxis
			.tickFormat(function(d){ return d3.time.format('%Y')(new Date(d)); });

		chart.yAxis
			.tickFormat(function(d){
				return '$' + d3.format(',.0f')(d);
			});
		
		d3.select('#chart1')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.datum(sData)
			.transition().duration(500).call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});
};
