var dbapi = require('./db.js');
var maindb = new dbapi.database("main.db");
var logindb = new dbapi.database("login.db");
var http = require('http');
var httpdispatcher = require('httpdispatcher');
var dispatcher = new httpdispatcher();

var GoogleAuth = require('google-auth-library');
var GAuth = new GoogleAuth;
const GOOGLE_CLIENT_ID = '316471932564-lua2b3k1dih7ta9ommf9tumimupe03bc.apps.googleusercontent.com';
var GoogleClient = new GAuth.OAuth2(GOOGLE_CLIENT_ID, '', '');

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

//Lets start our server
server.listen(PORT, function() {
  /*/logindb.query("DROP TABLE IF EXISTS Google",
    null,
    [[]]
  );//*/
  /*/logindb.query("DROP TABLE IF EXISTS Tokens",
    null,
    [[]]
  );//*/
  /*/logindb.query("DROP TABLE IF EXISTS Pair", null, [
    []
  ]);//*/
  /*/logindb.query("CREATE TABLE Google (Id INTEGER PRIMARY KEY AUTOINCREMENT, SubId TINYTEXT)", function(){}, [
    []
  ]);//*/
  /*/logindb.query("CREATE TABLE Tokens (SessionToken TINYTEXT, AuthToken TINYTEXT, AuthType TINYTEXT, Expires TIMESTAMP)", function(){}, [
    []
  ]);//*/
  /*logindb.query("CREATE TABLE Pair (PairToken TINYTEXT, PairType TINYTEYT, Expires TIMESTAMP)", null, [
    []
  ]);*/
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});

dispatcher.setStatic('/static');
dispatcher.setStaticDirname('static');

function latlongdist(lat1, lon1, lat2, lon2) {
  var dlon = (lon2 - lon1) * Math.PI / 180;
  var dlat = (lat2 - lat1) * Math.PI / 180;
  var a = Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTHR * c;
  return d;
}

function makeId(len) {
  var text = "";
  var possible = "ABCDEF0123456789";

  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function createAccount(type, foreignid, callback) {
  switch (type) {
    case "GOOGLE":
      logindb.wquery(
        "INSERT INTO Google (SubId) VALUES (?)",
        function(err, sqlres) {
          callback(true, this.lastID);
        },
        [[foreignid]]
      );
      break;
    default:
      callback(false, 0);
      break;
  }
}

function getProfile(token, type, callbackok, callbackerr) { //Check login
  //callback(accepted, internal ID, name, email, language, email verified, image)
  switch(type) {
    case "GOOGLE":
      GoogleClient.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        function(e, login) {
          if (e != null && e != undefined && e != "") {
            //Invalid login
            callbackerr();
          } else {
            //Valid login
            var payload = login.getPayload();
            var userid = payload['sub'];
            logindb.query( //get internal user id
              "SELECT Id FROM Google WHERE (SubId = ?)",
              function(err, sqlres) {
                if (sqlres.length > 0) {
                  //User exists
                  callbackok({
                    ID: sqlres[0].Id,
                    Name: payload['name'],
                    Email: payload['email'],
                    Locale: payload['locale'],
                    EmailVerified: payload['email_verified'],
                    Picture: payload['picture']
                  });
                } else {
                  //New user
                  createAccount(
                    type,
                    userid,
                    function(accepted, newid) {
                      if (accepted) {
                        callbackok({
                          ID: newid,
                          Name: payload['name'],
                          Email: payload['email'],
                          Locale: payload['locale'],
                          EmailVerified: payload['email_verified'],
                          Picture: payload['picture']
                        });
                      } else {
                        callbackerr();
                      }
                    }
                  );
                }
              },
              [[userid]]
            );
          }
        }
      );
    break;
    default:
      callbackerr();
    break;
  }
}

dispatcher.beforeFilter(/\//, function(req, res, chain) {
  res.writeHead(200, head);
  chain.next(req,res,chain);
});

dispatcher.onOptions(/\//, function(req, res) {
  res.writeHead(200, head);
  res.end();
});

dispatcher.onPost("/Questions", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT * FROM Questions WHERE QuestId = ?",
        function(err, sqlres) {
          res.write(JSON.stringify(sqlres));
          res.end();
        },
        [[req.params.Id]]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/QuestHeader", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      console.log(params.Id);
      maindb.rquery(
        "SELECT Id, Name, Description, Start, Latitude, Longitude FROM Quests WHERE Id = ?",
        function(err, sqlres) {
          res.write(JSON.stringify(sqlres));
          res.end();
        },
        [[params.Id]]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/Solution", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
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
        }, [[params.Id, params.Code]]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/Question", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT Question, Latitude, Longitude, Id, HashID FROM Questions WHERE Id = ? AND HashID = ?;",
        function(err, sqlres) {
          //console.log(sqlres.length);
          //console.log(res);
          if (sqlres.length == 1) {
            //console.log(sqlres);
            res.write(JSON.stringify(sqlres[0]));
          } else {
            res.write("Server error...");
          }
          res.end();
        }, [[params.Id, params.Code]]);
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/Quest", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT Start, Name, Description FROM Quests WHERE ? < Latitude AND Latitude < ? AND ? < Longitude AND Longitude < ?;",
        function(err, sqlres) {
          var resp = [];
          for (var i = 0; i < sqlres.length; i++) {
            resp.push({
              Name: sqlres[i].Name,
              Description: sqlres[i].Description,
              Start: sqlres[i].Start
            });
          }
          res.write(JSON.stringify(resp));
          res.end();
        },
        [
          [
            (+params.Latitude) - 0.0904,
            (+params.Latitude) + 0.0904,
            (+params.Longitude) - 0.0898 / Math.cos(+params.Latitude * Math.PI / 180.0),
            (+params.Longitude) + 0.0898 / Math.cos(+params.Latitude * Math.PI / 180.0)
          ]
        ]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/PairReq", function(req, res) {
  res.writeHead(200, head);
  //let params = JSON.parse(req.body);
  let stoken = makeId(64);
  /*logindb.query(
    "INSERT INTO Tokens (SessionToken, PairToken, PairType) VALUES (?,?,?)",
    function(err, sqlres) {
      res.write(stoken);
      res.end();
    },
    [[stoken, "", "GOOGLE"]]
  );*/
  res.write(JSON.stringify({code:stoken}));
  res.end();
});

dispatcher.onPost("/PairResp", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  //console.log(params);
  switch(params.type) {
    case "GOOGLE":
      GoogleClient.verifyIdToken(
        params.token,
        GOOGLE_CLIENT_ID,
        function(e, login) {
          if (e != null && e != undefined && e != "") {
            res.write(JSON.stringify({ok: false}));
            res.end();
          } else {
            logindb.query(
              "INSERT INTO Tokens (SessionToken, AuthToken, AuthType, Expires) VALUES (?,?,?,date('now', '+1 hour'))",
              function(err, sqlres) {
                res.write(JSON.stringify({ok: true}));
                res.end();
              },
              [[params.stoken, params.token, params.type]]
            );
          }
        }
      );
    break;
    default:

    break;
  }
});

dispatcher.onPost("/PairCheck", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  //console.log(params);
  //logindb.query(
  //"DELETE FROM Tokens WHERE DATE_SUB(Expires",
  //function(err, sqlres) {
  logindb.query(
    "SELECT SessionToken, AuthToken, AuthType FROM Tokens WHERE SessionToken = ? AND AuthType = ?",
    function(err, sqlres) {
      logindb.query(
        "DELETE FROM Tokens WHERE SessionToken = ? AND AuthType = ?",
        function(errd, sqlresd) {
          if(sqlres.length == 1) {
            switch(params.type) {
              case "GOOGLE":
                GoogleClient.verifyIdToken(
                  sqlres[0].AuthToken,
                  GOOGLE_CLIENT_ID,
                  function(e, login) {
                    if (e != null && e != undefined && e != "") {
                      res.write(JSON.stringify({Ok: 0}));
                      res.end();
                    } else {
                      res.write(JSON.stringify({Ok: 2, Token: sqlres[0].AuthToken}));
                      res.end();
                    }
                  }
                );
              break;
              default:
              res.write(JSON.stringify({Ok: 0}));
              res.end();
              break;
            }
          } else {
            res.write(JSON.stringify({Ok: 1}));
            res.end();
          }
        },
        [[params.stoken, params.type]]
      );
    },
    [[params.stoken, params.type]]
  );
  //},
  //[[]]
  //);
});

dispatcher.onPost("/Log", function(req, res) {
  console.log(req.params);
});
