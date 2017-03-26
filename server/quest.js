var base = require('./base.js');

//Radius of Earth for geological calculations
const EARTHR = 6371000.0;

function latlongdist(lat1, lon1, lat2, lon2) {
  var dlon = (lon2 - lon1) * Math.PI / 180;
  var dlat = (lat2 - lat1) * Math.PI / 180;
  var a = Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTHR * c;
  return d;
}

module.exports = function() {
  this.GetAllQuestions = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.rquery(
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
  }

  this.GetQuestHeader = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        console.log(params.Id);
        base.maindb.rquery(
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
  }

  this.SubmitQuestionSolution = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.rquery(
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
                  base.maindb.query(
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
  }

  this.GetOneQuestion = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.rquery(
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
  }

  this.GetSuggestions = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.rquery(
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
  }

  this.Create = function(req, res) {

    //console.log(req.params);
    var pall = JSON.parse(req.body);
    console.log(pall);
    var params = (pall.CreateData);
    console.log(params);
    console.log(params.questions);
    console.log(params.questions[0].Options);
    res.writeHead(200, base.head);

    var thisQuestId;
    getProfile(
      pall.id_token, pall.id_token_type,
      function(user) {
        function fInsert(i, n) {
          if (i == 0) {
            base.maindb.wquery(
              "INSERT INTO questions (HashID, Question, Answer, Next, Latitude, Longitude, Options, QuestId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              function(err, sqlres) {
                //console.log(this);
                base.maindb.wquery(
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
            base.maindb.wquery(
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
        base.maindb.wquery(
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
  }
}
