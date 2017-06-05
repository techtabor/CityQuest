var base = require('./base.js');


module.exports = function() {
  this.CreateTeam = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    //console.log(params);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        var resp = user;
        base.maindb.query(
          "INSERT INTO TeamData (Leader, Quest, Name, Type) VALUES (?, 0, ?, 2)",
          function(err1,sqlres1) {
            var arr = new Array(params.members.length);
            for(var i=0; i < params.members.length; i++) {
              arr[i] = [sqlres1.insertId, params.members[i].email];
            }
            var count = 0;
            var ok = 0;
            //console.log(arr);
            base.maindb.query(
              "INSERT INTO Teams (User, Team) (SELECT Id, ? FROM Users WHERE Email = ? )",
              function(err2,sqlres2) {
                //console.log(sqlres2);
                if(sqlres2.affectedRows == 1) {
                  ok++;
                }
                if(sqlres2.affectedRows > 1) {
                  console.log("ERROR, Too many users inserted! A");
                }
                count++;
                /*base.maindb.query(
                  "SHOW WARNINGS",
                  function(err3,sqlres3) {
                    console.log(sqlres3);
                  },
                  [[]]
                );*/
                if(count == params.members.length) {
                  if(ok == count) {
                    res.write(JSON.stringify({Ok:0}));
                  } else {
                    res.write(JSON.stringify({Ok:1, Message: (count-ok) + " users could not be added."}));
                  }
                  res.end();
                }
                if(count > params.members.length) {
                  console.log("ERROR, Too many users inserted! B");
                }
              },
              arr
            );
          },
          [user.ID, params.name]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.GetTeams = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "SELECT TeamMembers.Team AS Team, TeamMembers.Members AS Members, TeamData.Name AS Name, Users.Name AS LeaderName, Users.Email AS LeaderEmail, TeamData.Quest AS Quest FROM ( ( ( SELECT TeamsA.Team AS Team, COUNT(TeamsB.User) AS Members FROM Teams AS TeamsA INNER JOIN Teams AS TeamsB ON TeamsA.Team = TeamsB.Team WHERE TeamsA.User = ? GROUP BY TeamsA.Team ) TeamMembers INNER JOIN TeamData ON TeamMembers.Team = TeamData.Id ) INNER JOIN Users ON Users.Id = TeamData.Leader)",
          function(err,sqlres) {
            res.write(JSON.stringify({Ok:0, Members: sqlres}));
            res.end();
          },
          [user.ID]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.GetTeamMembers = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "SELECT Users.Name, Users.Email FROM Users INNER JOIN Teams ON Users.Id = Teams.User AND Teams.Team = ?",
          function(err,sqlres) {
            //console.log(sqlres);
            res.write(JSON.stringify({Ok:0, Members: sqlres}));
            res.end();
          },
          [params.team]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.LeaveTeam = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        //console.log(user.ID);
        //console.log(params.team);
        base.maindb.query(
          "SELECT Type, Leader FROM TeamData WHERE Id = ?",
          function(err1,sqlres1) {
            if(sqlres1.length == 1 && sqlres1[0].Type != 1 && sqlres1[0].Leader != user.ID) {
              base.maindb.query(
                "DELETE FROM Teams WHERE Team = ? AND User = ?",
                function(err,sqlres) {
                  //console.log(sqlres);
                  res.write(JSON.stringify({Ok:0, Members: sqlres}));
                  res.end();
                },
                [params.team, user.ID]
              );
            } else {
              if(sqlres1.length != 1) {
                res.write(JSON.stringify({Ok:1, Message: "Invalid team."}));
              } else {
                if(sqlres1[0].Type == 1) {
                  res.write(JSON.stringify({Ok:1, Message: "You can not leave your private team."}));
                } else {
                  if(sqlres1[0].Leader == user.ID) {
                    res.write(JSON.stringify({Ok:1, Message: "Team leaders can not leave."}));
                  } else {
                    res.write(JSON.stringify({Ok:1, Message: "Unknown error!"}));
                  }
                }
              }
              res.end();
            }
          },
          [user.Team]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.AddTeamMembers = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "SELECT Type, Leader, COUNT(Teams.User) AS Members FROM TeamData INNER JOIN Teams ON Teams.Team = TeamData.Id WHERE TeamData.Id = ? GROUP BY Teams.Team",
          function(err1,sqlres1) {
            //console.log(sqlres1);
            if(sqlres1.length == 1 && sqlres1[0].Members < 32 && sqlres1[0].Type != 1) {
              base.maindb.query(
                "INSERT INTO Teams (User, Team) (SELECT Id, ? AS TeamId FROM Users WHERE Email = ? AND Id NOT IN (SELECT User FROM Teams WHERE Team = ?))",
                function(err2,sqlres2) {
                  res.write(JSON.stringify({Ok:0, Message: ""}));
                  res.end();
                },
                [[params.team, params.email, params.team]]
              );
            }
            else {
              if(sqlres1.length != 1) {
                res.write(JSON.stringify({Ok:1, Message: "Invalid team."}));
              }
              else {
                if(sqlres1[0].Members >= 32) {
                  res.write(JSON.stringify({Ok:1, Message: "Team full."}));

                }
                else {
                  if(sqlres1[0].Type == 1) {
                    res.write(JSON.stringify({Ok:1, Message: "Can not add members to private team."}));
                  }
                  else {
                    res.write(JSON.stringify({Ok:1, Message: "Unknown error."}));
                  }
                }
                res.end();
              }
            }
          },
          [params.team]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.SetTeam = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "UPDATE Users SET Team = ? WHERE Id = ?",
          function(err1,sqlres1) {
            base.maindb.query(
              "SELECT Name FROM TeamData WHERE Id = ?",
              function(err2,sqlres2) {
                res.write(JSON.stringify({Ok:0, TeamName: sqlres2[0].Name}));
                res.end();
              },
              [params.team]
            );
          },
          [params.team, user.ID]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
}
