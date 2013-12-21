//This is a function to make dollar amounts look nice.	  
function Currency(sSymbol, vValue) {
  aDigits = vValue.toFixed().split(".");
  aDigits[0] = aDigits[0].split("").reverse().join("").replace(/(\d{3})(?=\d)/g,   "$1,").split("").reverse().join("");
  return sSymbol + aDigits.join(".");
}
//way of parsing year out of effective_date
function parseDate(dateString){
	dateStringLength = dateString.length;
	return dateString.slice(dateStringLength - 4, dateStringLength);
}	
//parse ZIPs
function parseZIP(zip){
	return zip.slice(0,5);
}
