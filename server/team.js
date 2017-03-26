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
          "INSERT INTO Users (SubId, Type, Name, Email) VALUES (0, 0, ?, '')",
          function(err1,sqlres1) {
            var arr = new Array(params.members.length);
            for(var i=0; i < params.members.length; i++) {
              arr[i] = [sqlres1.insertId, params.members[i].email];
            }
            var count = 0;
            var ok = 0;
            //console.log(arr);
            base.maindb.query(
              "INSERT INTO Teams (User, Team) (SELECT Id AS User, (?) AS Team FROM Users WHERE Email = ?)",
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
          [params.name]
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
          "SELECT UsersA.Team AS Team, UsersC.Members AS Members, UsersB.Name AS Name FROM ( ( (SELECT Team FROM Teams WHERE User = 1) UsersA INNER JOIN (SELECT Team, COUNT(User) AS Members FROM Teams GROUP BY Team) UsersC ON UsersC.Team = UsersA.Team) INNER JOIN (SELECT Name, Id FROM Users) UsersB ON UsersB.Id = UsersA.Team)",
          function(err,sqlres) {
            res.write(JSON.stringify({Ok:0, Members: sqlres}));
            res.end();
          },
          []
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
