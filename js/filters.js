//create a subset of data by FOI
function foiFilter(){
	
	foiData = $(this).data('foi');
	toggleFilter();	
	
	
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
// set the text inside the sidetooltip
	blackboxSetter();
// create the layer based on the current data
	createLayer();

}; //end foi filter function
		

		
function inclusionTest(yourList,dataID){
	//create the logic for inclusion in set to not count duplicates
	if (yourList.indexOf(dataID) === -1) {
		yourList.push(dataID);
	}
	return yourList;
};

mapper = function(){
	m = _.map(jdata, function(value,key){
		return { 
			'foi': value['Field_aggregate'] , 
			'year': parseDate(value['Effective_Date']),
			'amount': value['Amount']
			}
	});
	
	if (typeof(foiData) == 'undefined' || foiData == 'all'){
		return _.reduce(m, function(total,value){
			return total + value['amount'];
		}, 0);
	}
	
	return _.reduce(_.where(m, {'foi': foiData} ), function(total, value){ 
		return total + value['amount'];
	}, 0);
}

//by zip, by year, (by foi,depending) to obtain number of grants, dollar amount of grants, number of recipients

function getDollarAmounts(jdata,zip,foiData) {
	subDataByZip = [];
	z = [];
	totalAmountZip = 0;
	y = [];		

	for (var i = 0; i < jdata.length; i++){
		if(parseZIP(jdata[i].Zip) === zip && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
			subDataByZip.push(jdata[i]);
			ID = jdata[i].Grantee_ID;
			inclusionTest(z, ID);
			
			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			y.push(amt);
		}
	}
	//	numGrants = subDataByZip.length;
	//	numOrgs = z.length;
		for (var i = 0; i < y.length; i++) {
				totalAmountZip += y[i];
		}
	return totalAmountZip;
}

function getDollarAmountLight(hash,datum,foiData){
                if((datum.Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(datum.Effective_Date)){
                        
                        if (hash[datum.Zip]){
                                hash[datum.Zip] += datum.Amount;
                        } else{
                                hash[datum.Zip] = datum.Amount;
                        }
                }
                parseZIP(datum.Zip);
}
//end beta get dollars

function getFilteredArrayByZip(layer,jdata,foiData){
	subDataByZip = [];
	z = [];
	totalAmountZip = 0;
	y = [];
	for (var i = 0; i < jdata.length; i++){
		if(parseZIP(jdata[i].Zip) === layer.feature.properties.NAME && (jdata[i].Field_aggregate === foiData || foiData === 'all') && $('#slider').slider('option','value') == parseDate(jdata[i].Effective_Date)){
			subDataByZip.push(jdata[i]);
			ID = jdata[i].Grantee_ID;	
			inclusionTest(z, ID);
			
			var amt = jdata[i].Amount;
			amt = parseInt(amt);
			y.push(amt);
		}
	}
	
	numZipGrants = subDataByZip.length;
	numZipOrgs = z.length;
	for (var i = 0; i < y.length; i++) {
			totalAmountZip += y[i];
	}
	
	return [numZipOrgs,numZipGrants,totalAmountZip];
}
