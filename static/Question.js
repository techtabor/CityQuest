function loadQuestion() {
	$.post(
		"http://localhost:2017/Challange",
		{Id: document.getElementById("TaskID").value, Code: document.getElementById("TaskCode").value},
		function( data ) {
			document.getElementById("Question").innerHTML = data;
		}
	);
}

function sendSolution(pos) {
	//document.getElementById("Lat").innerHTML = pos.coords.latitude;
	//document.getElementById("Long").innerHTML = pos.coords.longitude;
	$.post(
		"http://localhost:2017/Solution",
		{Id: document.getElementById("TaskID").value, Code: document.getElementById("TaskCode").value, Sol: document.getElementById("Solution").value, Lat: pos.coords.latitude, Long: pos.coords.longitude},
		function( data ) {
			if(data) {
				var dataJson = JSON.parse(data);
				if(dataJson) {
					document.getElementById("Response").innerHTML = dataJson.msg;
					if(dataJson.check) {
						document.getElementById("submitButton").style.backgroundColor = "green";
						document.getElementById("TaskID").value = dataJson.next;
						document.getElementById("TaskCode").value = dataJson.code;
						document.getElementById("questionButton").click();
					} else {
						document.getElementById("submitButton").style.backgroundColor = "red";
					}
				} else {
					document.getElementById("submitButton").style.backgroundColor = "black";
				}
			} else {
				document.getElementById("submitButton").style.backgroundColor = "black";
			}
		}
	);
}

function submitSolution() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sendSolution);
	} else {
		document.getElementById("Response").value = "Please enable location services.";
	}
}

function getSuggestions(pos) {
	$.post(
		"http://localhost:2017/Quest",
		{Latitude: pos.coords.latitude, Longitude: pos.coords.longitude},
		function( data ) {
			var JSONdata = JSON.parse(data);
			document.getElementById("Suggestions").innerHTML = "";
			for(var i=0;i<JSONdata.length;i++) {
				var row = document.getElementById("Suggestions").insertRow(-1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				cell1.innerHTML = JSONdata[i].Name;
				cell2.innerHTML = JSONdata[i].Description;
				cell3.innerHTML = "<button class=\"w3-btn w3-dark-grey\" onclick='document.getElementById(\"TaskID\").value = \"" + JSONdata[i].Start + "\"; document.getElementById(\"setButton\").click(); document.getElementById(\"questionButton\").click();'>Go</button>";
			}
		}
	);
}

function loadSuggestions() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getSuggestions);
	} else {
		document.getElementById("Response").value = "Please enable location services.";
	}
}
