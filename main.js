window.data = [['term', 'occurrences']];

Array.prototype.pairs = function (func) {
	for (var i = 0; i < this.length - 1; i++) {
	    for (var j = i; j < this.length - 1; j++) {
	        func([this[i], this[j+1]]);
	    }
	}
}

Array.prototype.triplets = function (func) {
	for (var i = 0; i < this.length - 1; i++) {
	    for (var j = i; j < this.length - 1; j++) {
	    	for (var k = j; k < this.length - 1; k++) {
	        func([this[i], this[j+1], this[k+2]]);
	      }
	    }
	}
}

function runQuery() {
	var queryText = $("#query-data").val();
	var queryArray = queryText.split("\n");
	var queryLength = queryArray.length;

	if (queryLength >= 1) {
		queryArray.forEach(function (queryOne) {
		  var url = "https://content.guardianapis.com/search";
		  url += '?' + $.param({
		    'api-key': "89264c96-0794-4cb6-b61d-d87ebbc8c3f6",
		    'q': queryOne
		  });
		  $.ajax({
		    url: url,
		    method: 'GET',
		  }).done(function(result) {
		    window.data.push([ queryOne, result.response.total ])
		    $("#results-single").append("<p>" + queryOne + " : " + result.response.total + "</p>");
		  }).fail(function(err) {
		    console.log(err);
		  });
		})	
	}

	if (queryLength >= 2) {
		queryPairs = queryArray.pairs( function (pair) {
		  console.log(pair[0], pair[1])
		  var queryPair = pair[0] + " " + pair[1];
		  console.log(queryPair);
		  var url = "https://content.guardianapis.com/search";
		  url += '?' + $.param({
		    'api-key': "89264c96-0794-4cb6-b61d-d87ebbc8c3f6",
		    'q': queryPair
		  });
		  console.log(url)
		  $.ajax({
		    url: url,
		    method: 'GET',
		  }).done(function(result) {
		    window.data.push([ queryPair, result.response.total ])            
		    $("#results-pairs").append("<p>" + queryPair + " : " + result.response.total + "</p>");
		  }).fail(function(err) {
		    console.log(err);
		  });
		})
	}

	if (queryLength >= 3) {
		queryTriplets = queryArray.triplets( function (triplet) {
		  console.log(triplet[0], triplet[1], triplet[2])
		  var queryTriplet = triplet[0] + " " + triplet[1] + " " + triplet[2];
		  console.log(queryTriplet);
		  var url = "https://content.guardianapis.com/search";
		  url += '?' + $.param({
		    'api-key': "89264c96-0794-4cb6-b61d-d87ebbc8c3f6",
		    'q': queryTriplet
		  });
		  console.log(url)
		  $.ajax({
		    url: url,
		    method: 'GET',
		  }).done(function(result) {
		    window.data.push([ queryTriplet, result.response.total ])            
		    $("#results-triplets").append("<p>" + queryTriplet + " : " + result.response.total + "</p>");
		  }).fail(function(err) {
		    console.log(err);
		  });
		})	
	}

	document.getElementById('download-button').style.display = 'block'
}

function downloadData() {
	var data = window.data;
	var csvContent = "data:text/csv;charset=utf-8,";
	data.forEach(function(infoArray, index){
	  dataString = infoArray.join(",");
	  csvContent += index < data.length ? dataString+ "\n" : dataString;
	});
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "guardian_data.csv");
	document.body.appendChild(link);
	link.click();
}