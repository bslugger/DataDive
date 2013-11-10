function loaded() {

$(window).bind("load",function(){
	var jdata;
    $.getJSON("data/aaacfData.json", function(data){
        jdata = data;
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
	var subData = [];
	var totalAmount = 0;
	var numOrgs;
	var s = [];
	var numGrants;
	var a = [];

	function foi(){
		console.log('button clicked');
		foiData = $(this).data('foi');
		console.log(foiData);
		if (foiData != 'all') {
			$('#foi6').removeClass('hidden');
		} else {
			$('#foi6').addClass('hidden');
		}
		// $('.map').remove();
		// generateMap();

		subData = [];
		a = [];
		totalAmount = 0;
		s = [];
		for (var i = 0; i < jdata.length; i++) {
			if (jdata[i].Field_aggregate === foiData) {
				subData.push(jdata[i]);
				ID = jdata[i].Grantee_ID;

				//create the logic for inclusion in set to not count duplicates
				if (s.indexOf(ID) > -1) {
					//do nothing
				} else {
					s.push(ID);
				}
				var amt = jdata[i].Amount;
				amt = parseInt(amt);
				a.push(amt);			
				}
		};

		// the logic!
		numGrants = subData.length;
		numOrgs = s.length;
		for (var i = 0; i < a.length; i++) {
			totalAmount = totalAmount + a[i];
		}
		console.log("number of orgs", numOrgs);
		console.log("num of grants", numGrants);
		console.log("total awarded", totalAmount);
	}


	$('.foi').on('click', foi);

	
	// function sub(){
	// 	console.log('hello');
	// 	for (var i = 0; i < jdata.length; i++) {
	// 		if (jdata[i].Field_aggregate === foiData) {
	// 			subData = jdata[i];
	// 			// s.add(jdata[i].Grantee_ID);
	// 			// numOrgs = s.length;
	// 			numGrants = subData.length;
	// 			a.push(jdata[i].Amount);			
	// 			}
	// 	};
	// 	console.log(numOrgs);
	// 	console.log(numGrants);
	// 	console.log(totalAmount);
	// 	for (var x = 0; x < a.length; i++) {
	// 		totalAmount += a[x];
	// 	}
	// 	console.log(totalAmount);
	// }

	// sub();

	// $('.foi').on('click', sub);

	

	// var category = 'popular';
	// $('.target').on('change', function(){
	// 	p = 1;
	// 	category = $(this).val();
	// 	$('.results').remove();
	// 	getShot();
	// });


});
}
$(document).ready(loaded);