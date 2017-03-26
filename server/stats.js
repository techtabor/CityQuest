var base = require('./base.js');

module.exports = function() {
  this.GetPlayedStats = function(req, res) {
    //console.log("asd");
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
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
  }

  this.GetGlobalStats = function(req, res) {
    //console.log("asd");
    res.writeHead(200, base.head);
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          //"SELECT Quests.Id, Quests.Name, Quests.Description, Questions.Count FROM Quests INNER JOIN Questions WHERE Quests.Id IN (SELECT Quests.Id FROM Quests INNERJOIN Solutions WHERE Solutions.User = ? AND Solutions.Quest = Quests.Id)"
        "SELECT U.Name AS Name, S.Solved AS Solved FROM ((SELECT Id, Name FROM Users) U INNER JOIN (SELECT User, COUNT(DISTINCT Question) AS 'Solved' FROM Solutions WHERE Question <> 0 GROUP BY User) S ON U.Id = S.User) ORDER BY S.Solved DESC LIMIT 10",
          function(err, sqlres) {
            //console.log(JSON.stringify(sqlres));
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
  }

  this.GetFriendStats = function(req, res) {
    //console.log("asd");
    res.writeHead(200, base.head);
    /*let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
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
  }
}
