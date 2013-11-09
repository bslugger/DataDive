var width = $('svg').width();
var height = $('svg').height();
var padding = 100;
var stores = ["AA","AAW","NOV","NVL","TC1","TC2","WB"];
var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
var dataset = [];
var displayData = [];
var svg = d3.select('html').select('body').select('svg');
var LABOR_TO_REVENUE = 0.12;
var AVERAGE_PAYRATE = 10;
var WEEKS_IN_MONTH = 4.5;
d3.csv("http://localhost:8000/Codes%20d3/data/master_hourly.csv", function(data){
	console.log(data)
	dataset = data; 
	
	var dataSlice = dataset.filter(function(d){
		return (d.DCS == "SHORUNM" || d.DCS == "SHORUNW") &&  d.Hr >= 9 && d.Hr <= 20 && d.Str != "WHS" && d.Mon == 6 && d.Wk && d.WDay != "Sat" && d.WDay != "Sun" && d.Year == 2012;
	})
	
	console.log(dataSlice);
	criteria_array = Object.keys(dataSlice[0]);
	condense_filter = ["DCS","Wk","Day"];
	
	for(i in criteria_array){
		if(condense_filter.indexOf(criteria_array[i]) > -1)
			criteria_array[i] = "";
	}
	console.log(criteria_array);
	for (index in dataSlice){
		var counter = 1;
		if(typeof displayData !== 'undefined' && displayData.length > 0){
			var displayDataLength = displayData.length;
			for(displayIndex in displayData){
				if(dataSlice[index][criteria_array[0]] == displayData[displayIndex][criteria_array[0]] && dataSlice[index][criteria_array[1]] == displayData[displayIndex][criteria_array[1]] && dataSlice[index][criteria_array[4]] == displayData[displayIndex][criteria_array[4]] && dataSlice[index][criteria_array[5]] == displayData[displayIndex][criteria_array[5]] && dataSlice[index][criteria_array[6]] == displayData[displayIndex][criteria_array[6]] && dataSlice[index][criteria_array[7]] == displayData[displayIndex][criteria_array[7]] && dataSlice[index][criteria_array[8]] == displayData[displayIndex][criteria_array[8]]){
					for(i in criteria_array){
						if (criteria_array[i] == "Sold#" || criteria_array[i] == "ExtP$"){
								displayData[displayIndex][criteria_array[i]] += parseInt(dataSlice[index][criteria_array[i]]);
							}
					}
					displayData[displayIndex]['TimesAddedTo'] += 1;
					break;
				}
				else if (counter == displayDataLength && index != dataSlice.length + 1){
					displayData.push(new Object());
					for(i in criteria_array){
						if (criteria_array[i] == "Sold#" || criteria_array[i] == "ExtP$"){
							number = parseInt(dataSlice[index][criteria_array[i]]);
							displayData[displayIndex][criteria_array[i]] = number;
						}
						else{
							if(condense_filter.indexOf(criteria_array[i]) < 0)
								displayData[displayIndex][criteria_array[i]] = dataSlice[index][criteria_array[i]];
						}
						displayData[displayIndex]['TimesAddedTo'] = 1;
					}
				}
				counter += 1;
			}
		}
		else{
			displayData.push(new Object());
			for(i in criteria_array){
				if (criteria_array[i] == "Sold#" || criteria_array[i] == "ExtP$"){
					number = parseInt(dataSlice[index][criteria_array[i]]);
					displayData[0][criteria_array[i]] = number;
				}
				else{
					if(condense_filter.indexOf(criteria_array[i]) < 0)
						displayData[0][criteria_array[i]] = dataSlice[index][criteria_array[i]];
				}
				displayData[0]['TimesAddedTo'] = 1;
			}
		}
	}
	displayData.splice(displayData.length-1,displayData.length);
	//data values for domain extents
	var color_data = 'Str';
	var color_data_two = 'WDay';
	var x_data = 'Hr';
	var y_data = 'ExtP$';
	var r_data = 'Sold#';
	//getting the domain values
	var color_extent = d3.extent(displayData, function(d){return d[color_data];});
	var color_extent_two = d3.extent(displayData, function(d){return d[color_data_two];});
	var x_extent = d3.extent(displayData, function(d){return Math.abs(d[x_data])+ 12*stores.indexOf(d.Str);});
	var y_extent = d3.extent(displayData, function(d){return Math.floor(((Math.abs(d[y_data])*LABOR_TO_REVENUE)/AVERAGE_PAYRATE)/WEEKS_IN_MONTH);});	
	var r_extent = d3.extent(displayData, function(d){return Math.abs(d[r_data]);});
	//scales
	var color_scale = d3.scale.ordinal().domain(color_extent).range(colorbrewer.Set3[7]);
	var color_scale_two = d3.scale.ordinal().domain(color_extent_two).range(colorbrewer.Set1[7]);
	var x_scale = d3.scale.linear().domain(x_extent).range([padding, width - padding]);
	var y_scale = d3.scale.linear().domain(y_extent).range([height - padding, padding]);
	var r_scale = d3.scale.linear().domain(r_extent).range([2,10]).clamp([true]);
	console.log(x_extent + " " + y_extent + " " +  r_extent);
	//axis
	var x_axis = d3.svg.axis()
	x_axis.scale(x_scale).orient("bottom").ticks(5);
	//svg.append("g").attr("class","axis").attr("transform","translate(0," + (height-padding) + ")").call(x_axis);
	
	var y_axis = d3.svg.axis()
	y_axis.scale(y_scale).orient("left").ticks(5);
	svg.append("g").attr("class","axis").attr("transform","translate(" + (padding) + ",0)").call(y_axis);
	
	
	
	
	var div = d3.select("body").append("div")
				.attr("class","tooltip")
				.style("opacity",0);

	svg
	  .attr('width',width)
	  .attr('height',height)
	  .style("pointer-events","all");
	  //.on("mousemove", bubble);
	
		svg.selectAll('circle')
	   .attr('width',width)
	   .attr('height',height)
	   .data(displayData)
	   .enter().append('circle')
	   .style('fill', function(d){
			return color_scale(d.Str);
	   })
	   .style('opacity', .7)
	  // .style('stroke', function(d){return color_scale_two(color_data_two);})
	   //.style('stroke-width', 2)
	   .attr('cy',function(d,i){return y_scale(Math.floor(((Math.abs(d[y_data])*LABOR_TO_REVENUE)/AVERAGE_PAYRATE)/WEEKS_IN_MONTH));})
	   .attr('cx',function(d,i){return x_scale(Math.abs(d[x_data]) + 12*stores.indexOf(d.Str));})
	   .attr('r', function(d){return r_scale(Math.abs(Math.abs(d[r_data])));})
	   .on("mouseover", function(d){
			div.transition()
			    .duration(200)
				.style("opacity",.9);
			div. html(d.Str + "<br>" + "$" + d.ExtP$/WEEKS_IN_MONTH + "<br>" + d.Hr + "," + d.WDay + "," + d.Mon + "<br>" + Math.floor(((Math.abs(d[y_data])*LABOR_TO_REVENUE)/9)/WEEKS_IN_MONTH))
			    .style("left", function(){return (d3.event.pageX - 70)  + "px"})
			    .style("top",(d3.event.pageY) + "px");
				})
		.on("mouseout", function(d){
			div.transition()
			    .duration(500)
				.style("opacity",0);
				});
		
	console.log(displayData);
	});

	
