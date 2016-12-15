<<<<<<< HEAD
var db = require('./db.js');
var http = require('http');
var httpdispatcher = require('httpdispatcher');
var dispatcher = new httpdispatcher();

//Lets define a port we want to listen to
const PORT=2017;

//Create a server
var server = http.createServer(handleRequest);

function latlongdist(lat1, lon1, lat2, lon2) {
	var dlon = (lon2 - lon1)*Math.PI/180;
	var dlat = (lat2 - lat1)*Math.PI/180;
	var a = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.pow(Math.sin(dlon/2),2);
	var c = 2.0 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
	var r = 6371000.0;
	var d = r * c;
	return d;
}
/*
http.createServer(function (req, sqlres) {
	//console.log(req.url);
  dispatcher.dispatch(req, sqlres);
}).listen(PORT, '127.0.0.1');
*/
//Lets start our server
server.listen(PORT, function(){
	//db.query("CREATE TABLE Quests (Id BIGINT UNSIGNED, Name TINYTEXT, Description TEXT, Start BIGINT UNSIGNED, Latitude FLOAT, Longitude FLOAT, PRIMARY KEY (Id));");
	//db.query("CREATE TABLE Questions (Id BIGINT UNSIGNED, HashID VARCHAR(32), Question TEXT, Answer INT(10), Next BIGINT(20), Latitude FLOAT, Longitude FLOAT, PRIMARY KEY (Id));");

	//db.query("INSERT INTO Quests (Id, Name, Description, Start, Latitude, Longitude) VALUES (?,?,?,?,?,?)",[],[["1","Test1","Desc1 Bajza. u","10","47.512","19.0711"], ["2","Name 2","V\u00e1rosliget","0","47.515","19.081"], ["5","Balazs Track","Corvin teszt","3","47.4885","19.0746"], ["6","Tapolcsanyi","Teszt a tapolcsanyi k\u00f6rny\u00e9k\u00e9n","1","47.516","19.023"], ["7","Logischool","Tacht\u00e1bor demo at Logischool Budapest.","11","47.521","18.991"], ["8","Laci Teszt","Laci hazanal teszt ","13","47.5009","19.0576"]]);
	//db.query("INSERT INTO Questions (Id, HashID, Question, Answer, Next, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?, ?)",[], [["0","00000000000000000000000000000000","Congratulations, you have won!","0","0","0","0"], ["1","00000000000000000000000000000000","What is the 3rd prime","5","2","47.516","19.023"], ["2","eaaf52e9a37a8696b60a5c2f3b54c109","What is the next Fibonacci number after 13","21","0","47.516","19.023"], ["3","00000000000000000000000000000000","Menj a korvinba. Ott vagy? 1: igen, 0: nem","1","0","47.4858","19.073"], ["9","0fd7a555f2617883ddc8d99a84564b8d","Menj a rig\u00f3ba. Ott vagy?","1","0","47.49","19.0731"], ["10","00000000000000000000000000000000","H\u00e1nyadik emeleten van a Milestone? (ans:3)","3","0","47.512","19.0711"], ["11","00000000000000000000000000000000","What is the next perfect number after 28? ans: (496)","496","12","47.521","18.991"], ["12","944a57889c3dc0586c2f5a9090a77582","The answer is 654.","654","0","47.521","18.991"], ["13","00000000000000000000000000000000","What is the meaning of life, ...","42","14","47.5009","19.0576"], ["14","8c079ab63eaee23e141d0d7fb382f0e8","What is the next perfect number after 6?","28","0","47.5009","19.0576"]]);
	//Callback triggered when server is successfully listening. Hurray!
	console.log("Server listening on: http://localhost:%s", PORT);
});

//Lets use our dispatcher
function handleRequest(request, sqlresponse){
	try {
		//log the request on console
		console.log(request.url);
		//Disptach
		dispatcher.dispatch(request, sqlresponse);
	} catch(err) {
		console.log(err);
	}
}

dispatcher.setStatic('/static');
dispatcher.setStaticDirname('static');

dispatcher.onPost("/Solution", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	db.query("SELECT A.Answer, A.Next, A.Latitude, A.Longitude, B.HashID FROM Questions AS A INNER JOIN Questions AS B WHERE A.Id = ? AND A.HashID = ? AND A.Next = B.ID;", function (err, sqlres) {
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
	}, [req.params.Id, req.params.Code]);
});

dispatcher.onPost("/Challange", function(req, res) {
	//console.log("ASD");
	res.writeHead(200, {'Content-Type': 'text/plain'});
	//res.write("a");
	//res.write("b");
	//res.end();
	db.query("SELECT Question FROM Questions WHERE Id = ? AND HashID = ?;", function (err, sqlres) {
		//console.log(sqlres.length);
		//console.log(res);
		if(sqlres.length == 1) {
			res.write(sqlres[0].Question);
		} else {
			res.write("Server error...");
		}
		res.end();
	}, [req.params.Id, req.params.Code]);
});

dispatcher.onPost("/Quest", function(req, res) {

	res.writeHead(200, {'Content-Type': 'text/plain'});
	db.query("SELECT Start, Name, Description FROM Quests WHERE ? < Latitude AND Latitude < ? AND ? < Longitude AND Longitude < ?;", function (err, sqlres) {
		var resp = [];
		for(var i=0; i<sqlres.length; i++) {
			resp.push({Name: sqlres[i].Name, Description: sqlres[i].Description, Start: sqlres[i].Start});
		}
		res.write(JSON.stringify(resp));
		res.end();
	}, [(+req.params.Latitude)-0.0904, (+req.params.Latitude)+0.0904, (+req.params.Longitude)-0.0898/Math.cos(+req.params.Latitude*Math.PI/180.0), (+req.params.Longitude)+0.0898/Math.cos(+req.params.Latitude*Math.PI/180.0)]);
});

dispatcher.onPost("/Test", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write("asdfghj");
	res.end();
});
=======
var db = require('./db.js');
var dispatcher = require('httpdispatcher');


function cb(err, res) {
	console.log(res);
}
/*
//fooldal
app.get('/', function (req, res) {
    console.log('request homera');
    db.query("SELECT * FROM Asd WHERE Test<=(?)", cb, [[5],[8],[48]]);
	res.end();
});


app.listen(2017, function () {
    console.log('Elindult a szerver');
});*/

var http = require('http');

//Lets define a port we want to listen to
const PORT=2017; 

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//For all your static (js/css/images/etc.) set the directory name (relative path).
//dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});
>>>>>>> 75ec937c19886ec993b766c7e99c5af64da08826
