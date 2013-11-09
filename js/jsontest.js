var width = $('svg').width();
var height = $('svg').height();
var dataset = [];
var displayData = [];
var stores = ["AA","AAW","NOV","NVL","TC1","TC2","WB"];
var padding = 95;
var svg = d3.select('html').select('body').select('svg');
function convertToPercent(fraction) {
	var number;
	number = (fraction * 100);
	temp = number.toFixed(1);
	return temp + '&#37;';
}

d3.json("http://localhost:8000/Codes%20d3/data/rawjson.json", function(data){
	dataset = data;
	console.log(dataset);
});