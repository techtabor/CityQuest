var dbapi = require('./db.js');
var maindb = new dbapi.database("test.db");
var http = require('http');
var httpdispatcher = require('httpdispatcher');
var dispatcher = new httpdispatcher();
var head = {
  'Content-Type': 'text/plain',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Method": "POST,GET,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "X-Requested-With,Content-Type"
};

//Lets define a port we want to listen to
const PORT = 2017;

//Radius of Earth for geological calculations
const EARTHR = 6371000.0;

//Create a server
var server = http.createServer(handleRequest);

function latlongdist(lat1, lon1, lat2, lon2) {
  var dlon = (lon2 - lon1) * Math.PI / 180;
  var dlat = (lat2 - lat1) * Math.PI / 180;
  var a = Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTHR * c;
  return d;
}

//Lets start our server
server.listen(PORT, function() {
  //maindb.query("DROP TABLE Asd", null, [[]]);
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});

//Lets use our dispatcher
function handleRequest(request, sqlresponse) {
  try {
    //log the request on console
    console.log(request.url);
    //Disptach
    dispatcher.dispatch(request, sqlresponse);
  } catch (err) {
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

//dispatcher.setStatic('/static');
//dispatcher.setStaticDirname('static');

/*dispatcher.onOptions("", function(req, res) {
	res.writeHead(200, head);
})*/

dispatcher.onPost("/Questions", function(req, res) {
  res.writeHead(200, head);
  console.log("/Questions");
  maindb.rquery(
    "SELECT * FROM Questions WHERE QuestId = ?",
    function(err, sqlres) {
      res.write(JSON.stringify(sqlres));
      res.end();
    },
    req.body
  );
});

dispatcher.onPost("/QuestHeader", function(req, res) {
  res.writeHead(200, head);
  //console.log("/QuestHeader");
  maindb.rquery(
    "SELECT Id, Name, Description, Start, Latitude, Longitude FROM Quests WHERE Id = ?",
    function(err, sqlres) {
        res.write(JSON.stringify(sqlres));
      res.end();
    },
    req.body
  );
});

dispatcher.onPost("/Solution", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  console.log(params);
  maindb.rquery(
    "SELECT A.Answer, A.Next, A.Latitude, A.Longitude, B.HashID FROM Questions AS A INNER JOIN Questions AS B WHERE A.Id = ? AND A.HashID = ? AND A.Next = B.ID;",
    function(err, sqlres) {
      if (sqlres.length == 1) {
        if (latlongdist(params.Lat, params.Long, sqlres[0].Latitude, sqlres[0].Longitude) <= 150) {
          if (sqlres[0].Answer == params.Sol) {
            res.write('{"Correct": true, "Response":"OK.", "NextId":' +
              sqlres[0].Next + ', "NextCode":"' + sqlres[0].HashID +
              '"}');
          } else {
            res.write('{"Correct": false, "Response":"Wrong answer.", "NextId": 0, "NextCode": 0}');
          }
        } else {
          res.write('{"Correct": false, "Response":"Too far, you are ' +
            Math.round(latlongdist(params.Lat, params.Long, sqlres[0].Latitude, sqlres[0].Longitude)) +
            ' meters away.", "NextId": 0, "NextCode": 0}');
        }
      } else {
        res.write('{"Correct": false, "Response":"Incorrect question", "NextId": 0, "NextCode": 0}');
      }
      res.end();
    }, [params.Id, params.Code]
  );
});

dispatcher.onPost("/Question", function(req, res) {
	//console.log("ASD");
	res.writeHead(200, head);
	//res.write("a");
	//res.write("b");
	//res.end();
	let params = JSON.parse(req.body);
	console.log(params.Id + ' ' + params.Code);

	maindb.rquery(
		"SELECT Question, Latitude, Longitude, Id, HashID FROM Questions WHERE Id = ? AND HashID = ?;",
		function (err, sqlres) {
			//console.log(sqlres.length);
			//console.log(res);
			if(sqlres.length == 1) {
        //console.log(sqlres);
				res.write(JSON.stringify(sqlres[0]));
			} else {
				res.write("Server error...");
			}
			res.end();
		},
		[params.Id, params.Code]);
	}
);

dispatcher.onPost("/Quest", function(req, res) {

	res.writeHead(200, head);
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
  var params = JSON.parse(req.body);
  console.log(params);
  //console.log(params.Questions[0]);
  res.writeHead(200, head);

  function fInsert(i, n) {
    if (i == 0) {
      maindb.wquery(
        "INSERT INTO Questions (HashID, Question, Answer, Next, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?)",
        function(err, sqlres) {
          //console.log(this);
          maindb.wquery(
            "INSERT INTO Quests (Name, Description, Start, Latitude, Longitude) VALUES (?, ?, ?, ?, ?)",
            null, [
              params.header.Name,
              params.header.Description,
              this.lastID,
              params.header.Latitude,
              params.header.Longitude
            ]
          );
        }, [
          "00000000000000000000000000000000",
          params.questions[i].Question,
          params.questions[i].Answer,
          n,
          params.questions[i].Latitude,
          params.questions[i].Longitude
        ]
      );
    }
    if (i > 0) {
      maindb.wquery(
        "INSERT INTO Questions (HashID, Question, Answer, Next, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?)",
        function(err, sqlres) {
          fInsert(i - 1, this.lastID);
        }, [
          makeId(32),
          params.questions[i].Question,
          params.questions[i].Answer,
          n,
          params.questions[i].Latitude,
          params.questions[i].Longitude
        ]
      );
    }
  }
  fInsert(params.questions.length - 1, 0);
  res.write("OK");
  res.end();
});

dispatcher.onPost("/Log", function(req, res) {
  console.log(req.params);
});
