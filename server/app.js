var dbapi = require('./db.js');
var maindb;
var logindb;
var http = require('http');
var httpdispatcher = require('./httpdispatcher.js');
var dispatcher = new httpdispatcher();
var fs = require("fs");

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
  //logindb = new dbapi.database("main.db");
  //console.log(logindb);
  /*if(false) { //set to true if you crashed.
    console.log("Login database corrupt!!!");
    logindb.db.close(
      function(){
        fs.unlink(
          "login.db",
          function(){
            logindb = new dbapi.database("login.db");
            logindb.query("CREATE TABLE Tokens (SessionToken TINYTEXT, AuthToken TINYTEXT, AuthType TINYTEXT, Expires TIMESTAMP)", function(){}, [
              []
            ]);
            logindb.query("CREATE TABLE Google (Id INTEGER PRIMARY KEY AUTOINCREMENT, SubId TINYTEXT)", function(){}, [
              []
            ]);
          }
        )
      }
    );
  } else {
    logindb.query("DELETE FROM Tokens WHERE 1=1", function(){}, [
      []
    ]);
  }*/
  maindb = new dbapi.database("main.db");
  logindb = maindb;
  /*if(!maindb.db.open) {
    console.log("Main database corrupt!!!");
    maindb.db.close(
      function(){
        fs.unlink(
          "main.db",
          function(){
            maindb = new dbapi.database("main.db");
          }
        )
      }
    );
  }*/
  /*logindb.query("CREATE TABLE Google (Id INTEGER PRIMARY KEY AUTOINCREMENT, SubId TINYTEXT)", function(){}, [
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

function createAccount(type, foreignid, user, callback) {
  switch (type) {
    case "GOOGLE":
      logindb.wquery(
        "INSERT INTO Users (SubId, Type, Name, Email) VALUES (?, 1, ?, ?)",
        function(err, sqlres) {
          callback(true, this.lastID);
        },
        [[foreignid, user.Name, user.Email]]
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
              "SELECT Id FROM Users WHERE (SubId = ? AND Type = 1)",
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
                    {
                      Name: payload['name'],
                      Email: payload['email'],
                      Locale: payload['locale'],
                      EmailVerified: payload['email_verified'],
                      Picture: payload['picture']
                    },
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

dispatcher.onPost("/GetAllQuestions", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT * FROM Questions WHERE QuestId = ?",
        function(err, sqlres) {
          for(var i=0; i<sqlres.length; i++) {
            sqlres[i].Options = JSON.parse(sqlres[i].Options);
          }
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

dispatcher.onPost("/GetQuestHeader", function(req, res) {
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

dispatcher.onPost("/SubmitQuestionSolution", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT A.Answer, A.Next, A.Latitude, A.Longitude, A.QuestId, B.HashID FROM Questions AS A INNER JOIN Questions AS B WHERE A.Id = ? AND A.HashID = ? AND A.Next = B.ID;",
        function(err, sqlres) {
          if (sqlres.length == 1) {
            if (latlongdist(params.Lat, params.Long, sqlres[0].Latitude, sqlres[0].Longitude) <= 150) {
              if (sqlres[0].Answer == params.Sol) {
                res.write('{"Correct": true, "Response":"OK.", "NextId":' +
                  sqlres[0].Next + ', "NextCode":"' + sqlres[0].HashID +
                  '"}'
                );
                var arr = [[user.ID, sqlres[0].QuestId, params.Id]];
                if(sqlres[0].Next == 0) {
                  arr.push([user.ID, sqlres[0].QuestId, 0]);
                }
                maindb.query(
                  "INSERT INTO Solutions(User, Quest, Question) VALUES (?,?,?)",
                  function(erri, sqlresi) {
                    res.end();
                  },
                  arr
                );
              } else {
                res.write('{"Correct": false, "Response":"Wrong answer.", "NextId": 0, "NextCode": 0}');
                res.end();
              }
            } else {
              res.write('{"Correct": false, "Response":"Too far, you are ' +
                Math.round(latlongdist(params.Lat, params.Long, sqlres[0].Latitude, sqlres[0].Longitude)) +
                ' meters away.", "NextId": 0, "NextCode": 0}'
              );
              res.end();
            }
          } else {
            res.write('{"Correct": false, "Response":"Incorrect question", "NextId": 0, "NextCode": 0}');
            res.end();
          }

        }, [[params.Id, params.Code]]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/GetOneQuestion", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT Question, Options, Latitude, Longitude, Id, HashID FROM Questions WHERE Id = ? AND HashID = ?;",
        function(err, sqlres) {
          //console.log(sqlres.length);
          //console.log(res);
          if (sqlres.length == 1) {
            //console.log(sqlres);
            sqlres[0].Options = JSON.parse(sqlres[0].Options);
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

dispatcher.onPost("/GetSuggestions", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.rquery(
        "SELECT Start, Name, Description, Id FROM Quests",
        function(err, sqlres) {
          var resp = [];
          for (var i = 0; i < sqlres.length; i++) {
            resp.push({
              Id: sqlres[i].Id,
              Name: sqlres[i].Name,
              Description: sqlres[i].Description,
              Start: sqlres[i].Start
            });
          }
          res.write(JSON.stringify(resp));
          res.end();
        },
        []
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/GetPlayedStats", function(req, res) {
  //console.log("asd");
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.query(
        //"SELECT Quests.Id, Quests.Name, Quests.Description, Questions.Count FROM Quests INNER JOIN Questions WHERE Quests.Id IN (SELECT Quests.Id FROM Quests INNERJOIN Solutions WHERE Solutions.User = ? AND Solutions.Quest = Quests.Id)"
      "SELECT	Q.Id AS Id, S.Solved AS Solved, Q.Name AS Name, Q.Description AS Description, Qn.Total AS Questions FROM	Quests Q INNER JOIN ( (SELECT QuestId, COUNT(*) AS 'Total' FROM Questions GROUP BY QuestId) Qn INNER JOIN (SELECT Quest, COUNT(DISTINCT Question) AS 'Solved' FROM Solutions WHERE User = ? AND Question <> 0 GROUP BY Quest) S	ON Qn.QuestId = S.Quest) ON S.Quest = Q.Id ORDER BY S.Solved",
        function(err, sqlres) {
          //console.log(JSON.stringify(sqlres));
          /*sqlres.sort(function(a, b) {
            return a.Solved / a.Total - b.Solved / b.Total;
          });*/
          res.write(JSON.stringify({Ok:0, Stats: sqlres}));
          res.end();
        },
        [[user.ID]]
      );
      var resp;
      //resp.Ok = 0;
      //res.write(JSON.stringify(resp));

    },
    function() {
      //console.log("Invalid");
      res.write(JSON.stringify({Ok:1}));
      res.end();
    }
  );
});

dispatcher.onPost("/GetGlobalStats", function(req, res) {
  //console.log("asd");
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.query(
        //"SELECT Quests.Id, Quests.Name, Quests.Description, Questions.Count FROM Quests INNER JOIN Questions WHERE Quests.Id IN (SELECT Quests.Id FROM Quests INNERJOIN Solutions WHERE Solutions.User = ? AND Solutions.Quest = Quests.Id)"
      "SELECT U.Name AS Name, S.Solved AS Solved FROM ((SELECT Id, Name FROM Users) U INNER JOIN (SELECT User, COUNT(DISTINCT Question) AS 'Solved' FROM Solutions WHERE Question <> 0 GROUP BY User) S ON U.Id = S.User) ORDER BY S.Solved DESC LIMIT 10",
        function(err, sqlres) {
          console.log(JSON.stringify(sqlres));
          //console.log(sqlres);
          res.write(JSON.stringify({Ok:0, Stats: sqlres}));
          res.end();
        },
        [[]]
      );
      var resp;
      //resp.Ok = 0;
      //res.write(JSON.stringify(resp));

    },
    function() {
      //console.log("Invalid");
      res.write(JSON.stringify({Ok:1}));
      res.end();
    }
  );
});

dispatcher.onPost("/GetFriendStats", function(req, res) {
  //console.log("asd");
  res.writeHead(200, head);
  /*let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      maindb.query(
        //"SELECT Quests.Id, Quests.Name, Quests.Description, Questions.Count FROM Quests INNER JOIN Questions WHERE Quests.Id IN (SELECT Quests.Id FROM Quests INNERJOIN Solutions WHERE Solutions.User = ? AND Solutions.Quest = Quests.Id)"
      "SELECT	Q.Id AS Id, S.Solved AS Solved, Q.Name AS Name, Q.Description AS Description, Qn.Total AS Questions FROM	Quests Q INNER JOIN ( (SELECT QuestId, COUNT(*) AS 'Total' FROM Questions GROUP BY QuestId) Qn INNER JOIN (SELECT Quest, COUNT(DISTINCT Question) AS 'Solved' FROM Solutions WHERE User = ? AND Question <> 0 GROUP BY Quest) S	ON Qn.QuestId = S.Quest) ON S.Quest = Q.Id",
        function(err, sqlres) {
          //console.log(JSON.stringify(sqlres));
          sqlres.sort(function(a, b) {
            return a.Solved / a.Total - b.Solved / b.Total;
          });
          res.write(JSON.stringify({Ok:0, Stats: sqlres}));
          res.end();
        },
        [[user.ID]]
      );
      var resp;
      //resp.Ok = 0;
      //res.write(JSON.stringify(resp));

    },
    function() {
      //console.log("Invalid");
      res.write(JSON.stringify({Ok:1}));
      res.end();
    }
  );*/
  res.write(JSON.stringify({Ok:0, Stats: []}));
  res.end();
});

dispatcher.onPost("/LoginPairCode", function(req, res) {
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

dispatcher.onPost("/LoginPairResp", function(req, res) {
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

dispatcher.onPost("/LoginPairCheck", function(req, res) {
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

dispatcher.onPost("/Create", function(req, res) {

  //console.log(req.params);
  var pall = JSON.parse(req.body);
  console.log(pall);
  var params = (pall.CreateData);
  console.log(params);
  console.log(params.questions);
  console.log(params.questions[0].Options);
  res.writeHead(200, head);

  var thisQuestId;
  getProfile(
    pall.id_token, pall.id_token_type,
    function(user) {
      function fInsert(i, n) {
        if (i == 0) {
          maindb.wquery(
            "INSERT INTO questions (HashID, Question, Answer, Next, Latitude, Longitude, Options, QuestId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            function(err, sqlres) {
              //console.log(this);
              maindb.wquery(
                "UPDATE Quests SET Start = ? WHERE Id = ?",
                function() {
                    res.write("{'Ok':0}");
                    res.end();
                }, [
                  this.lastID,
                  thisQuestId
                ]
              );
            }, [
              "00000000000000000000000000000000",
              params.questions[i].Question,
              params.questions[i].Answer,
              n,
              params.questions[i].Latitude,
              params.questions[i].Longitude,
              JSON.stringify(params.questions[i].Options),
              thisQuestId
            ]
          );
        }
        if (i > 0) {
          maindb.wquery(
            "INSERT INTO questions (HashID, Question, Answer, Next, Latitude, Longitude, Options, QuestId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            function(err, sqlres) {
              fInsert(i - 1, this.lastID);
            }, [
              makeId(32),
              params.questions[i].Question,
              params.questions[i].Answer,
              n,
              params.questions[i].Latitude,
              params.questions[i].Longitude,
              JSON.stringify(params.questions[i].Options),
              thisQuestId
            ]
          );
        }
      }
      maindb.wquery(
        "INSERT INTO Quests (Name, Description, Start, Latitude, Longitude) VALUES (?, ?, ?, ?, ?)",
        function() {
          thisQuestId = this.lastID;
          fInsert(params.questions.length - 1, 0);

        }, [
          params.header.Name,
          params.header.Description,
          0,
          params.header.Latitude,
          params.header.Longitude
        ]
      );
    },
    function() {
      res.end();
    }
  );
});

dispatcher.onPost("/VerifyLogin", function(req, res) {
  res.writeHead(200, head);
  let params = JSON.parse(req.body);
  getProfile(
    params.id_token, params.id_token_type,
    function(user) {
      var resp = user;
      resp.Ok = 0;
      res.write(JSON.stringify(resp));
      res.end();
    },
    function() {
      res.write(JSON.stringify({Ok:1}));
      res.end();
    }
  );
});

dispatcher.onPost("/Log", function(req, res) {
  console.log(req.params);
});
