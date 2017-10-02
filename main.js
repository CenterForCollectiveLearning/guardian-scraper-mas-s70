window.data = [['term', 'occurrences']];

Array.prototype.pairs = function (func) {
	for (var i = 0; i < this.length - 1; i++) {
	    for (var j = i; j < this.length - 1; j++) {
	        func([this[i], this[j+1]]);
	    }
	}
}

function runQuery() {
	console.log("starting runQuery");
	var queryText = $("#query-data").val();
	console.log(queryText);
	var queryArray = queryText.split("\n");
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