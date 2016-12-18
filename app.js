var dbapi = require('./db.js');
var maindb = new dbapi.database("test.db");
var http = require('http');
var httpdispatcher = require('httpdispatcher');
var dispatcher = new httpdispatcher();

//Lets define a port we want to listen to
const PORT=2017;

//Radius of Earth for geological calculations
const EARTHR = 6371000.0;

//Create a server
var server = http.createServer(handleRequest);

function latlongdist(lat1, lon1, lat2, lon2) {
	var dlon = (lon2 - lon1)*Math.PI/180;
	var dlat = (lat2 - lat1)*Math.PI/180;
	var a = Math.pow(Math.sin(dlat/2),2) +
	Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.pow(Math.sin(dlon/2),2);
	var c = 2.0 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
	var d = EARTHR * c;
	return d;
}

//Lets start our server
server.listen(PORT, function(){
	//maindb.query("DROP TABLE Asd", null, [[]]);
	//Callback triggered when server is successfully listening. Hurray!
	console.log("Server listening on: http://localhost:%s", PORT);
});

//Lets use our dispatcher
function handleRequest(request, sqlresponse){
	try {
		//log the request on console
		console.log(request.url + " " + request.method);
		//Disptach
		dispatcher.dispatch(request, sqlresponse);
	} catch(err) {
		console.log(err);
	}
}

function makeId(len) {
	var text = "";
	var possible = "ABCDEF0123456789";

	for (var i = 0; i < len; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

dispatcher.setStatic('/static');
dispatcher.setStaticDirname('static');

dispatcher.beforeFilter(/\//, function(req, res, chain) {
	res.writeHead(200, {
		"Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "POST,GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With,Content-Type"});
		chain.next(req,res,chain);
});

dispatcher.onOptions(/\//, function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain',
		"Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "POST,GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With,Content-Type"});
	res.end();
});

dispatcher.onPost("/Solution", function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'});
	maindb.rquery(
		"SELECT A.Answer, A.Next, A.Latitude, A.Longitude, B.HashID FROM Questions AS A INNER JOIN Questions AS B WHERE A.Id = ? AND A.HashID = ? AND A.Next = B.ID;",
		function (err, sqlres) {
			if(sqlres.length==1) {
				if(latlongdist(req.params.Lat, req.params.Long, sqlres[0].Latitude, sqlres[0].Longitude) <= 150) {
					if(sqlres[0].Answer == req.params.Sol) {
						res.write('{"check": true, "msg":"OK.", "next":' +
						sqlres[0].Next + ', "code":"' + sqlres[0].HashID +
						'"}');
					} else {
						res.write('{"check": false, "msg":"Wrong answer.", "next": 0, "code": 0}');
					}
				} else {
					res.write('{"check": false, "msg":"Too far, you are ' +
					Math.round(latlongdist(req.params.Lat, req.params.Long, sqlres[0].Latitude, sqlres[0].Longitude)) +
					' meters away.", "next": 0, "code": 0}');
				}
			} else {
				res.write('{"check": false, "msg":"Incorrect question", "next": 0, "code": 0}');
			}
			res.end();
		},
		[req.params.Id, req.params.Code]);
	});

	dispatcher.onPost("/Challange", function(req, res) {
		//console.log("ASD");
		res.writeHead(200, {
			'Content-Type': 'text/plain'});
		//res.write("a");
		//res.write("b");
		//res.end();
		maindb.rquery(
			"SELECT Question FROM Questions WHERE Id = ? AND HashID = ?;",
			function (err, sqlres) {
				//console.log(sqlres.length);
				//console.log(res);
				if(sqlres.length == 1) {
					res.write(sqlres[0].Question);
				} else {
					res.write("Server error...");
				}
				res.end();
			},
			[req.params.Id, req.params.Code]);
		}
	);

	dispatcher.onPost("/Quest", function(req, res) {

		res.writeHead(200, {
			'Content-Type': 'text/plain'});
		maindb.rquery(
			"SELECT Start, Name, Description FROM Quests WHERE ? < Latitude AND Latitude < ? AND ? < Longitude AND Longitude < ?;",
			function (err, sqlres) {
				var resp = [];
				for(var i=0; i<sqlres.length; i++) {
					resp.push({Name: sqlres[i].Name, Description: sqlres[i].Description, Start: sqlres[i].Start});
				}
				res.write(JSON.stringify(resp));
				res.end();
			},
			[(+req.params.Latitude)-0.0904, (+req.params.Latitude)+0.0904, (+req.params.Longitude)-0.0898/Math.cos(+req.params.Latitude*Math.PI/180.0), (+req.params.Longitude)+0.0898/Math.cos(+req.params.Latitude*Math.PI/180.0)]);
		}
	);

	dispatcher.onPost("/Create", function(req, res) {
		//console.log(req.params);
		var params = JSON.parse(req.params.Params);
		//console.log(params);
		//console.log(params.Questions[0]);
		res.writeHead(200, {
			'Content-Type': 'text/plain'});
		function fInsert(i,n) {
			if(i==0) {
				maindb.wquery(
					"INSERT INTO Questions (HashID, Question, Answer, Next, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?)",
					function(err,sqlres) {
						//console.log(this);
						maindb.wquery(
							"INSERT INTO Quests (Name, Description, Start, Latitude, Longitude) VALUES (?, ?, ?, ?, ?)",
							null,
							[
								params.Name,
								params.Desc,
								this.lastID,
								params.Latitude,
								params.Longitude
							]
						);
					},
					[
						"00000000000000000000000000000000",
						params.Questions[i].Question,
						params.Questions[i].Answer,
						n,
						params.Questions[i].Latitude,
						params.Questions[i].Longitude
					]
				);
			}
			if(i>0) {
				maindb.wquery(
					"INSERT INTO Questions (HashID, Question, Answer, Next, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?)",
					function(err, sqlres) {
						fInsert(i-1, this.lastID);
					},
					[
						makeId(32),
						params.Questions[i].Question,
						params.Questions[i].Answer,
						n,
						params.Questions[i].Latitude,
						params.Questions[i].Longitude
					]
				);
			}
		}
		fInsert(params.Questions.length-1, 0);
		res.write("OK");
		res.end();
	});

	dispatcher.onPost("/Log", function(req, res) {
		res.writeHead(200, {
			'Content-Type': 'text/plain'});
		console.log(req.params);
		res.end();
	});
