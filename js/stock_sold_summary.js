var width = 1400;
var height = 500;
var dataset = [];
var displayData = [];
var tempData = [];
var stores = ["AA","AAW","NOV","NVL","TC1","TC2","WB"];
var padding = 70;
var svg = d3.select('#wrapper').append('svg')
			.attr('width',width)
			.attr('height',height)
			.attr('float','right');
var swap = true;
function convertToPercent(fraction) {
	var number;
	number = (fraction * 100);
	temp = number.toFixed(0) + '%';
	return temp;
}
function convertToDollars(fraction) {
	var number;
	number = fraction;
	temp = number;
	return temp;
}
function setKeyValueRange(data,key){
	var valueSet = new Array();
	for(index in data){
		if(valueSet.indexOf(data[index][key]) == -1)
			valueSet.push(data[index][key]);
	}
	return valueSet;
}
function generateTooltipText(data){
	var keys = d3.keys(data);
	var keyFilter = ["SoldM%","OHExtP$"];
	// var tooltipText = data.Attr + "<br>" + data.VC + "<br>" + data.Desc1 + "<br>" + data.Str;
	var tooltipText = "";
	for (key in keys){
		if (data[keys[key]] !== undefined && keyFilter.indexOf(keys[key]) == -1 ){
			if(keys[key] == 'PercentStockSold'){
				tooltipText += keys[key] + ": " + convertToPercent(data[keys[key]]) + "<br>";
			}
			else if(keys[key].toString().indexOf("$") !== -1){
				tooltipText += keys[key] + ": $" + data[keys[key]] + "<br>";
			}
			else{
				tooltipText += keys[key] + ": " + data[keys[key]] + "<br>";
			}
			}
	}
	return tooltipText;
}
function sumArray(array){
	var sum = 0;
	for(i in array)
		sum += array[i];
	return sum;
}
function changeColor(data, new_color_data){
	var color_data = new_color_data;
	var color_scale = d3.scale.ordinal().domain(setKeyValueRange(displayData,color_data).sort()).range(colorbrewer.Set1[9]);
	
	svg.selectAll("circle").data(displayData).transition().duration(3000)
		   .style("fill",function(d){return color_scale(d[color_data])})
		   .style("opacity", .8);

}
function changeDataset(data, dcs_filter,vc_filter,str_filter, con_filter, color_filter,oh_filter,sold_filter){
	dataset = data[0]['items'];
	displayData = [];
	var div = d3.select("body").append("div").attr("class","tooltip").style("opacity",0);
	//This is the initial set of filters for the dataset, it should be a wide sweep
	var dataSlice = dataset.filter(function(d){
		return dcs_filter.indexOf(d.DCS) > -1 && (vc_filter[0] != 0 ? vc_filter.indexOf(d.VC) > -1 : true) && str_filter.indexOf(d.Str) > -1 ;
		});

	criteria_array = Object.keys(dataSlice[0]);
	condense_filter = con_filter;
	condense_filter.push('Item#');
	for(i in criteria_array){
		if(condense_filter.indexOf(criteria_array[i]) > -1)
			criteria_array[i] = "";
	}
	
	
	for (index in dataSlice){
		var counter = 1;
		if(typeof displayData !== 'undefined' && displayData.length > 0){
			var displayDataLength = displayData.length;
			for(displayIndex in displayData){
				if(dataSlice[index][criteria_array[0]] == displayData[displayIndex][criteria_array[0]] && dataSlice[index][criteria_array[1]] == displayData[displayIndex][criteria_array[1]] && dataSlice[index][criteria_array[2]] == displayData[displayIndex][criteria_array[2]]&& dataSlice[index][criteria_array[3]] == displayData[displayIndex][criteria_array[3]] && dataSlice[index][criteria_array[4]] == displayData[displayIndex][criteria_array[4]] && dataSlice[index][criteria_array[5]] == displayData[displayIndex][criteria_array[5]] && dataSlice[index][criteria_array[11]] == displayData[displayIndex][criteria_array[11]]){
					for(i in criteria_array){
						if (criteria_array[i] == "SoldQty" || criteria_array[i] == "SoldExtP$"|| criteria_array[i] == "OHQty"){
								displayData[displayIndex][criteria_array[i]] += parseInt(dataSlice[index][criteria_array[i]]);
							}
					}
					displayData[displayIndex]['PercentStockSold'] = displayData[displayIndex]['SoldQty'] + displayData[displayIndex]['OHQty'] == 0 ? 0 :(displayData[displayIndex]['SoldQty'] / (displayData[displayIndex]['SoldQty'] + displayData[displayIndex]['OHQty']));
					break;
				}
				else if (counter == displayDataLength && index != dataSlice.length + 1){
					displayData.push(new Object());
					for(i in criteria_array){
						if (criteria_array[i] == "SoldQty" || criteria_array[i] == "SoldExtP$"|| criteria_array[i] == "OHQty"){
							number = parseInt(dataSlice[index][criteria_array[i]]);
							displayData[displayIndex][criteria_array[i]] = number;
						}
						else{
							if(condense_filter.indexOf(criteria_array[i]) < 0)
								displayData[displayIndex][criteria_array[i]] = dataSlice[index][criteria_array[i]];
						}
						displayData[displayIndex]['PercentStockSold'] = displayData[displayIndex]['SoldQty'] + displayData[displayIndex]['OHQty'] == 0 ? 0 :(displayData[displayIndex]['SoldQty'] / (displayData[displayIndex]['SoldQty'] + displayData[displayIndex]['OHQty']));
						displayData[displayIndex]['Date'] = data[0].name;
					}
				}
				counter += 1;
			}
		}
		else{
			displayData.push(new Object());
			for(i in criteria_array){
				if (criteria_array[i] == "SoldQty" || criteria_array[i] == "SoldExtP$"|| criteria_array[i] == "OHQty"){
					number = parseInt(dataSlice[index][criteria_array[i]]);
					displayData[0][criteria_array[i]] = number;
				}
				else{
					if(condense_filter.indexOf(criteria_array[i]) < 0)
						displayData[0][criteria_array[i]] = dataSlice[index][criteria_array[i]];
				}
				displayData[0]['PercentStockSold'] = displayData[0]['SoldQty'] + displayData[0]['OHQty'] == 0 ? 0 :(displayData[0]['SoldQty'] / (displayData[0]['SoldQty'] + displayData[0]['OHQty']));
				displayData[0]['Date'] = data[0].name;
			}
		}
	}
	displayData.splice(displayData.length-1,displayData.length);
	displayData = displayData.filter(function(d){return d.OHQty >= oh_filter && d.SoldQty >= sold_filter && d.PercentStockSold >= 0});

	//setting variables for domains
	var color_data = color_filter;
	var color_data_two = 'Str';
	var x_data = 'SoldQty';
	var y_data = 'PercentStockSold';
	var r_data = 'OHQty';
	//getting the domain values
	var color_extent = d3.extent(displayData, function(d){return d[color_data];});
	var color_extent_two = d3.extent(displayData, function(d){return d[color_data_two];});
	var x_extent = d3.extent(displayData, function(d){return Math.abs(d[x_data]);});
	var y_extent = d3.extent(displayData, function(d){return Math.abs(d[y_data]);});	
	var r_extent = d3.extent(displayData, function(d){return Math.abs(d[r_data]);});
	var color_range = colorbrewer.Set1[9];
	for(i = 0; i < 8; i++){
		color_range.push(colorbrewer.Dark2[8][i]);
	}
	console.log(color_range);
	//scales
	var color_scale = d3.scale.ordinal().domain(setKeyValueRange(displayData,color_data).sort()).range(color_range);
	var color_scale_two = d3.scale.ordinal().domain(["3/20/2013","4/24/2013","5/1/2013","5/6/2013"]).range(colorbrewer.Greys[4]);
	var x_scale = d3.scale.linear().domain(x_extent).range([padding, width - padding]);
	var y_scale = d3.scale.linear().domain(y_extent).range([height - padding, padding]).clamp([true]);
	var r_scale = d3.scale.linear().domain(r_extent).range([5,15]).clamp([true]);
	//axis
	if(!svg.selectAll(".x_axis").empty()){
		var x_axis = d3.svg.axis()
		var y_axis = d3.svg.axis()
		x_axis.scale(x_scale).orient("bottom").ticks(5);
		y_axis.scale(y_scale).orient("left").tickFormat(y_data == 'PercentStockSold'?convertToPercent:convertToDollars).ticks(5);
		svg.selectAll(".x_axis").transition().duration(3000).attr("class","x_axis").attr("transform","translate(0,"+(height-padding)+")").call(x_axis);
		svg.selectAll(".y_axis").transition().duration(3000).attr("class","y_axis").attr("transform","translate("+(padding)+",0)").call(y_axis);
		}
	else{
		var x_axis = d3.svg.axis()
		x_axis.scale(x_scale).orient("bottom").ticks(5);
		svg.append("g").attr("class","x_axis").attr("transform","translate(0," + (height-padding) + ")").call(x_axis);
		var y_axis = d3.svg.axis()
		y_axis.scale(y_scale).orient("left").tickFormat(y_data == 'PercentStockSold'?convertToPercent:convertToDollars).ticks(5);
		svg.append("g").attr("class","y_axis").attr("transform","translate(" + (padding) + ",0)").call(y_axis);
		}
	//adding points to scatterplot
	svg.selectAll("circle")
	   .attr("height",height)
	   .attr("width",width)
	   .data(displayData).enter().append("circle")
	   .style("opacity",0)
	   .style("fill",function(d){return color_scale(0)})
	   .attr("r",0)
	   .on("mouseover", function(d){	
			div.transition()
				.duration(200)
				.style("opacity",.8);
			div. html(generateTooltipText(d))
				.style("left", function(){return (d3.event.pageX - 70) + "px"})
				.style("top",(d3.event.pageY) + "px");
				})
		.on("mouseout", function(d){
			div.transition()
				.duration(500)	
				.style("opacity",0)
				});
	  
	svg.selectAll("circle").data(displayData).transition().duration(3000)
	   .attr("cx",function(d){return x_scale(Math.abs(d[x_data]))})
	   .attr("cy",function(d){return y_scale(Math.abs(d[y_data]))})
	   .attr("r",function(d){return r_scale(Math.abs(d[r_data]))})
	   .style("fill",function(d){return color_scale(d[color_data])})
	   .style("opacity", .8);
		   
		svg.selectAll("circle").data(displayData).exit().transition().duration(3000).style("opacity",.0001).remove();
	//axes labels
	svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - padding)
    .attr("y", height - padding/4)
    .text("items sold (last thirty days)");
	svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 1)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90) translate(-50)")
    .text("% stock sold");
	}
function getRadioValue(name){
	var group = document.getElementsByName(name);
	
	for (var i = 0; i < group.length;i++){
		if(group[i].checked){
			return group[i].value;
		}
	}
	return "";
}
function getCheckboxValue(name){
	var group = document.getElementsByName(name);
	var valueArray = [];
	for (var i = 0; i < group.length;i++){
		if(group[i].checked){
			valueArray.push(group[i].value);
		}
	}
	return valueArray;
}
function getTextValue(name){
	var text = document.getElementById(name);
	if(text.value)
		return text.value;
	return 0;
}
d3.json("data/JSON/current.json",function(data){
	console.log(data)
	// var nest = d3.nest().key(function(d){return d['VC']})
						   // .sortKeys(d3.descending)
						   // .key(function(d){return d['Str']})
						   // .sortKeys(d3.ascending)
						   // .key(function(d){return d.DCS})
						   // .sortKeys(d3.ascending)
						   // .key(function(d){return d.Desc1})
						   // .sortKeys(d3.ascending)
						   // .rollup(function(d){
							// return{
								// OHQty:d3.sum(d,function(g){return +g.OHQty}),
								// SoldQty:d3.sum(d,function(g){return +g.SoldQty}),
								// SoldExtP$:d3.sum(d,function(g){return +g.SoldExtP$})
							// };
						   // })
						   // .map(data[0]['items']);
	// var nested_data = d3.entries(nest);						   
							   
	// console.log(nested_data);
	
	tempData = data;
	
	
	var selectedColorData = getRadioValue('colorData');
	var selectedDcs = getCheckboxValue('dcs');
	var selectedStr = getCheckboxValue('str');
	var selectedCondense = getCheckboxValue('condense');
	var selectedOH = getTextValue('OHQty');
	var selectedSold = getTextValue('SoldQty');
	var selectedVC = getTextValue('vc');
	
	changeDataset(data,selectedDcs,[selectedVC.toString().toUpperCase()],selectedStr,selectedCondense,selectedColorData,selectedOH, selectedSold);
	$('#update').click(function(){
		var selectedColorData = getRadioValue('colorData');
		var selectedDcs = getCheckboxValue('dcs');
		var selectedStr = getCheckboxValue('str');
		var selectedCondense = getCheckboxValue('condense');
		var selectedOH = getTextValue('OHQty');
		var selectedSold = getTextValue('SoldQty');
		var selectedVC = getTextValue('vc');
		
		changeDataset(data,selectedDcs,[selectedVC.toString().toUpperCase()],selectedStr,selectedCondense,selectedColorData,selectedOH, selectedSold);
	});
	$('#buymode').click(function(){
		var selectedColorData = getRadioValue('colorData');
		var selectedDcs = getCheckboxValue('dcs');
		var selectedStr = getCheckboxValue('str');
		var selectedCondense = ['Str']
		var selectedOH = getTextValue('OHQty');
		var selectedSold = getTextValue('SoldQty');
		var selectedVC = getTextValue('vc');
		
		changeDataset(data,selectedDcs,[selectedVC.toString().toUpperCase()],selectedStr,selectedCondense,selectedColorData,selectedOH, selectedSold);
	});
	$('#vendorsalesmode').click(function(){
		var selectedColorData = 'VC';
		var selectedDcs = getCheckboxValue('dcs');
		var selectedStr = getCheckboxValue('str');
		var selectedCondense = ['Str','Desc1','Attr','Size']
		var selectedOH = getTextValue('OHQty');
		var selectedSold = getTextValue('SoldQty');
		var selectedVC = getTextValue('vc');
		
		
		changeDataset(data,selectedDcs,[selectedVC.toString().toUpperCase()],selectedStr,selectedCondense,selectedColorData,selectedOH, selectedSold);
	});
	$('#switch').click(function(){
	if(swap){
		swap = false;
		changeColor(displayData, 'Str');
	}
	else{
		swap = true;
		changeColor(displayData, 'VC');
		}
	});
	});	
	