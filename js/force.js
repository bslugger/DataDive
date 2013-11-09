var w = $('svg').width()
var h = $('svg').height()
var svg = d3.select('html').select('body').select('svg');

var nodes[];


svg
	.attr('height', height)
	.attr('width', width)
	.on("click", scatter);
	
var nodes = nodes = d3.range(100).map(Object);

var force = d3.layout.force()
	.nodes(nodes)
	.links([])
	.size([width,height])
	.start();	

			
