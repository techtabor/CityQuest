var base = require('./base.js');


module.exports = function() {
  this.AddFriend = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);

    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        if(params.friendEmail != user.Email) {
          base.maindb.query(
            "INSERT INTO Friends (UserA, UserB, Accepted) (SELECT ? AS UserA, Id AS UserB, ? AS Accepted FROM Users WHERE Email=? AND Id NOT IN (SELECT UserA FROM Friends WHERE UserB = ? UNION SELECT UserB FROM Friends WHERE UserA = ?))",
            function(err, sqlres) {
              res.write(JSON.stringify({Ok:0}));
              res.end();
            },
            [[user.ID, 0, params.friendEmail, user.ID, user.ID]]
          );
        } else {
          res.write(JSON.stringify({Ok:2})); //Cant add self
          res.end();
        }
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.GetFriends = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);

    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "SELECT Users.Name, Users.Email FROM Users INNER JOIN Friends ON Friends.UserB = Users.ID AND Friends.UserA = ? AND Friends.Accepted = 1",
          function(err, sqlres) {
            res.write(JSON.stringify({Ok:0, Friends: sqlres}));
            res.end();
          },
          [[user.ID]]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.GetFriendRequests = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);

    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "SELECT Users.Name, Users.Email FROM Users INNER JOIN Friends ON Friends.UserA = Users.ID AND Friends.UserB = ? AND Friends.Accepted = 0",
          function(err, sqlres) {
            console.log(user.ID);
            res.write(JSON.stringify({Ok:0, Friends: sqlres}));
            res.end();
          },
          [[user.ID]]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.ConfirmRequest = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);

    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        if(params.accepted) {
          base.maindb.query(
            "UPDATE Friends SET Accepted = 1 WHERE UserB = ? AND UserA IN (SELECT Id FROM Users WHERE Email=?)",
            function(err, sqlres) {
              base.maindb.query(
                "INSERT INTO Friends (Accepted, UserA, UserB) (SELECT 1 AS Accepted, ? AS UserA, Id AS UserB FROM Users WHERE Email=?)",
                function(err2, sqlres2) {
                  res.write(JSON.stringify({Ok:0}));
                  res.end();
                },
                [[user.ID, params.friendemail]]
              );
            },
            [[user.ID, params.friendemail]]
          );
        } else {
          base.maindb.query(
            "DELETE FROM Friends WHERE UserA = ? AND UserB IN (SELECT Id FROM Users WHERE Email=?) ",
            function(err, sqlres) {
              res.write(JSON.stringify({Ok:0}));
              res.end();
            },
            [[user.ID, params.friendemail]]
          );
        }
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
  this.RemoveFriend = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);

    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          "DELETE FROM Friends WHERE (UserA = ? AND UserB IN (SELECT Id FROM Users WHERE Email=?)) OR (UserB = ? AND UserA IN (SELECT Id FROM Users WHERE Email=?))",
          function(err, sqlres) {
            res.write(JSON.stringify({Ok:0}));
            res.end();
          },
          [[user.ID, params.friendEmail, user.ID, params.friendEmail]]
        );
      },
      function() {
        res.write(JSON.stringify({Ok:1}));
        res.end();
      }
    );
  }
}
