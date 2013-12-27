//This will be used to aggregate year giving data together.
//TODO: Nothing essential, but one annoying issue with the x-axis. Something is weird here with rounding and leap years and what not.
// could just reduce the number of ticks for the x-axis, potentially. 
roundYear = function(ms) {
	beginYearMs = 0;
	step = 31556900000;
	endYearMs = step;
	//want to take milliseconds and find what year those milliseconds are a part of, then return those seconds
	
	while(ms > beginYearMs){
		if(ms < endYearMs && ms > beginYearMs){
			ms = endYearMs;
		}
		endYearMs += step;
		beginYearMs += step;	
	}		
	return ms;
}

getYears = function(){
	var allYears = [];
	_.each(almost, function(value,key){ 
		temp = []; 
		_.each(value.values, function(value2,key2){ 
			temp.push(value2[0]) 
					
		}) 
		allYears = _.union(allYears,temp);	
	});	
	return allYears.sort(function(a,b){return a - b});
}

clusterYears = function(){
	y = getYears();
	_.each(almost, function(value,key){
		temp = [];
		cluster = _.groupBy(value.values, function(value2,key2){return value2[0];})
		_.each(cluster, function(value3,yearMs){
			
			yearTotal = _.reduce(value3, function(total, amt) {
				return total + amt[1];
			},0)
			temp.push([parseInt(yearMs),yearTotal])	
					
		});
		//fill in blanks here
		addBlankYears(temp);
		//update array values with aggregated values
		almost[key].values = temp;
	});
}

addBlankYears = function(array){
//cycle through years serially, finding missing years, and adding them.	
	if(array.length < y.length){
		for (year in y){
			if (typeof(array[year]) == 'undefined' || array[year][0] !=  y[year] ){
				array.splice(year,0,[y[year],0]);
			}
		}
	}	
}

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
}

addChart = function(){
	clusterYears();
	format = d3.time.format('%m/%d/%Y');
	
	nv.addGraph(function() {
		var chart = nv.models.stackedAreaChart()
				.x(function(d){ return d[0] })
				.y(function(d){ return d[1] })
				.color(function(d){return setChartColor(d)}) //super hacky, but I don't known any other way.
				.clipEdge(true)
				.tooltipContent(function(key,x,y,e,graph){
					return '<h1>' + x +  '</h1>'+
					      '<h1>' + y + '</h1>' +
					      '<h1>' + key + '</h1>';
				});

		chart.xAxis
			.tickFormat(function(d){ return d3.time.format('%Y')(new Date(d)) });

		chart.yAxis
			.tickFormat(function(d){
				return '$' + d3.format(',.0f')(d);
			});
		
		d3.select('#chart1')
			.append('svg')
			.datum(almost)
			.transition().duration(500).call(chart);

		nv.utils.windowResize(chart.update);

		return chart;
	});
}
console.log('here');

