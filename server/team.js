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
          "INSERT INTO TeamData (Leader, Quest, Name, Type) VALUES (?, 0, ?, 1)",
          function(err1,sqlres1) {
            var arr = new Array(params.members.length);
            for(var i=0; i < params.members.length; i++) {
              arr[i] = [sqlres1.insertId, params.members[i].email];
            }
            var count = 0;
            var ok = 0;
            //console.log(arr);
            base.maindb.query(
              "INSERT INTO Teams (User, Team) (SELECT Id, ? AS TeamId FROM Users WHERE Email = ?)",
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
          "SELECT TeamMembers.Team AS Team, TeamMembers.Members AS Members, TeamData.Name AS Name, Users.Name AS LeaderName, Users.Email AS LeaderEmail, TeamData.Quest AS Quest FROM ( ( ( SELECT Team, COUNT(User) AS Members FROM Teams WHERE User = ? GROUP BY Team ) TeamMembers INNER JOIN TeamData ON TeamMembers.Team = TeamData.Id ) INNER JOIN Users ON Users.Id = TeamData.Leader )",
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
          "DELETE FROM Teams WHERE Team = ? AND User = ?",
          function(err,sqlres) {
            //console.log(sqlres);
            res.write(JSON.stringify({Ok:0, Members: sqlres}));
            res.end();
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
