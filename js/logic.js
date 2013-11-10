function loaded() {

$(window).bind("load",function(){
	var jdata;
	//getting our json data
    $.getJSON("data/aaacfData.json", function(data){
        jdata = data;
    });
	
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
		foiData = $(this).data('foi');
		console.log('button clicked: ',foiData);
		if (foiData != 'all') {
			$('#foi6').removeClass('hidden');
		} else {
			$('#foi6').addClass('hidden');
		}
		// $('.map').remove();
		// generateMap();

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

		// the logic to determine aggregated sums by FOI!
		numGrants = subData.length;
		numOrgs = s.length;
		for (var i = 0; i < a.length; i++) {
			totalAmount = totalAmount + a[i];
		}
		console.log("number of orgs", numOrgs);
		console.log("num of grants", numGrants);
		console.log("total awarded", totalAmount);
	} //end foi function


	$('.foi').on('click', foi);

	
	//the function to filter by zip code
	function zipfilter(){
		// console.log(zip);

	}
	zipfilter();


	$('.zip').on('hover', zipfilter);

});
}
$(document).ready(loaded);