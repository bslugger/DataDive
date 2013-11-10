function loaded() {
	var jdata;
    $.getJSON("data/aaacfData.json", function(data){
        jdata = data;
        console.log(jdata);
    });

	// d3.json('data/aaacfData.json', function(data) {
	// 	jdata = data;
	// 	return jdata;
	// });
	
	function generateMap() {
		//update map
	}

	//create a subset of data by FOI
	var foiData = 'all';
	var zipData;
	var yearData = 'all';
	for (var i = 0; i < jdata.length; i++) {
		$('.foi').on('click', function(){
			var foiData = 'all';
			foiData = $(this).data('foi');
			console.log(foiData);
			if foiData != 'all' {
				$('#foi6').removeAttr('hidden');
			}
			$('.map').remove();
			generateMap();
		});
	};

	// var category = 'popular';
	// $('.target').on('change', function(){
	// 	p = 1;
	// 	category = $(this).val();
	// 	$('.results').remove();
	// 	getShot();
	// });
}

$(document).ready(loaded);