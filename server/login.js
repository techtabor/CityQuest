var base = require('./base.js');


module.exports = function() {
  this.GoogleAuth = require('google-auth-library');
  this.GAuth = new GoogleAuth;
  this.GOOGLE_CLIENT_ID = '316471932564-lua2b3k1dih7ta9ommf9tumimupe03bc.apps.googleusercontent.com';
  this.GoogleClient = new GAuth.OAuth2(GOOGLE_CLIENT_ID, '', '');

  this.makeId = function(len) {
    var text = "";
    var possible = "ABCDEF0123456789";

    for (var i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  this.createAccount = function(type, foreignid, user, callback) {
    switch (type) {
      case "GOOGLE":
        base.maindb.wquery(
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

  this.getProfile = function(token, type, callbackok, callbackerr) { //Check login
    //callback(accepted, internal ID, name, email, language, email verified, image)
    switch(type) {
      case "GOOGLE":
        GoogleClient.verifyIdToken(
          token,
          GOOGLE_CLIENT_ID,
          function(e, login) {
            if (e != null && e != undefined && e != "" && e != false) {
              //Invalid login
              callbackerr();
            } else {
              //Valid login
              var payload = login.getPayload();
              var userid = payload['sub'];
              base.maindb.query( //get internal user id
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

  this.LoginPairCode = function(req, res) {
    res.writeHead(200, base.head);
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
  }

  this.LoginPairResp = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    //console.log(params);
    switch(params.type) {
      case "GOOGLE":
        GoogleClient.verifyIdToken(
          params.token,
          GOOGLE_CLIENT_ID,
          function(e, login) {
            if (e != null && e != undefined && e != "" && e != false) {
              res.write(JSON.stringify({ok: false}));
              res.end();
            } else {
              base.maindb.query(
                "INSERT INTO Tokens (SessionToken, AuthToken, AuthType, Expires) VALUES (?,?,?,"+
                /*"date('now', '+1 hour')"+*/ //SQLITE
                "DATE_ADD(NOW(), INTERVAL 1 HOUR)"+ //MYSQL
                ")",
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
  }

  this.LoginPairCheck = function(req, res) {
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    //console.log(params);
    //logindb.query(
    //"DELETE FROM Tokens WHERE DATE_SUB(Expires",
    //function(err, sqlres) {
    base.maindb.query(
      "SELECT SessionToken, AuthToken, AuthType FROM Tokens WHERE SessionToken = ? AND AuthType = ?",
      function(err, sqlres) {
        base.maindb.query(
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
  }

  this.VerifyLogin = function(req, res) {
    res.writeHead(200, base.head);
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
  }
}
