Array.prototype.pairs = function (func) {
	for (var i = 0; i < this.length - 1; i++) {
	    for (var j = i; j < this.length - 1; j++) {
	        func([this[i], this[j+1]]);
	    }
	}
}

Array.prototype.triplets = function (func) {
	for (var i = 0; i < this.length - 2; i++) {
    for (var j = i; j < this.length - 2; j++) {
    	for (var k = j; k < this.length - 2; k++) {
        func([this[i], this[j + 1], this[k + 2]]);
      }
    }
	}
}

function addQuotesIfSpace(s) {
	if ( s.indexOf(' ') >= 0 ) {
		return '"' + s + '"'
	} else {
		return s;
	}
}

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};

function runQuery() {
	var queryText = $("#query-data").val().trim();
	var queryArray = queryText.split("\n").map(addQuotesIfSpace);
	var queryLength = queryArray.length;

	window.dataArray = [['term', 'occurrences']];
	window.dataObject = {
		"single": {},
		"pair": {},
		"triplet": {}
	};

	$(".results").empty();

	var apiKey = $("#api-key-input").val()
	var chosenYear = $("#chosen-year").val()

	var fromDate = "1990-01-01"
	var toDate = "2018-01-01"

	if (chosenYear !== "all") {
		fromDate = chosenYear + "-01-01"
		toDate = chosenYear + "-12-31"
	}

	if (queryLength >= 1) {
		queryArray.forEach(function (queryOne) {
		  var url = "https://content.guardianapis.com/search";
		  url += '?' + $.param({
		    'api-key': apiKey,
		    'q': queryOne,
				'from-date': fromDate,
				'to-date': toDate,
		  });
		  $.ajax({
		    url: url,
		    method: 'GET',
		  }).done(function(result) {
		    window.dataArray.push([ queryOne, result.response.total ])
		    window.dataObject["single"][queryOne] = result.response.total
		    $("#results-single").append("<p>" + queryOne + " : " + result.response.total + "</p>");
		  }).fail(function(err) {
		    console.log(err);
		  });
		})
	}

	if (queryLength >= 2) {
		queryPairs = queryArray.pairs( function (pair) {
		  console.log(pair[0], pair[1])
		  var queryPair = pair.join(' AND ');
		  var queryPairSemicolonSep = pair.join(';');

		  var url = "https://content.guardianapis.com/search";
		  url += '?' + $.param({
		    'api-key': apiKey,
		    'q': queryPair,
				'from-date': fromDate,
				'to-date': toDate,
		  });

		  $.ajax({
		    url: url,
		    method: 'GET',
		  }).done(function(result) {
		    window.dataArray.push([ queryPairSemicolonSep, result.response.total ])
		    window.dataObject["pair"][queryPairSemicolonSep] = result.response.total
		    $("#results-pairs").append("<p>" + queryPair + " : " + result.response.total + "</p>");
		  }).fail(function(err) {
		    console.log(err);
		  });
		})
	}

	// if (queryLength >= 3) {
	// 	queryTriplets = queryArray.triplets( function (triplet) {
	// 	  var queryTriplet = triplet.join(' AND ');
	// 	  var queryTripletSemicolonSep = triplet.join(';');
	//
	// 	  var url = "https://content.guardianapis.com/search";
	// 	  url += '?' + $.param({
	// 	    'api-key': "89264c96-0794-4cb6-b61d-d87ebbc8c3f6",
	// 	    'q': queryTriplet,
	// 			'from-date': fromDate,
	// 			'to-date': toDate,
	// 	  });
	// 	  $.ajax({
	// 	    url: url,
	// 	    method: 'GET',
	// 	  }).done(function(result) {
	// 	    window.dataArray.push([ queryTripletSemicolonSep, result.response.total ])
	// 	    window.dataObject["triplet"][queryTripletSemicolonSep] = result.response.total
	// 	    $("#results-triplets").append("<p>" + queryTriplet + " : " + result.response.total + "</p>");
	// 	  }).fail(function(err) {
	// 	    console.log(err);
	// 	  });
	// 	})
	// }

	$('.download-button').css('display', 'block');
}

function downloadData(filetype) {
	var dataArray = window.dataArray;
	var dataObject = window.dataObject;
	var content = ''

	if (filetype == "csv") {
		content = "data:text/csv;charset=utf-8,";
		dataArray.forEach(function(infoArray, index){
		  dataString = infoArray.join(",");
		  content += index < dataArray.length ? dataString + "\n" : dataString;
		});
		content = encodeURI(content);
	}

	if (filetype == "json") {
		var str = JSON.stringify(dataObject);
		content = "data:application/json;charset=utf-8," + encodeURIComponent(str);
	}

	var link = document.createElement("a");
	link.setAttribute("href", content);
	link.setAttribute("download", "guardian_data." + filetype );
	document.body.appendChild(link);
	link.click();
}
