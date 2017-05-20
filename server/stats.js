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
        "SELECT Quests.Id AS Id, SolvedQuestions.Solved AS Solved, Quests.Name AS Name, Quests.Description AS Description, QuestQuestions.Total AS Questions FROM ( Quests INNER JOIN ( ( SELECT QuestId, COUNT(*) AS Total FROM Questions GROUP BY QuestId ) QuestQuestions INNER JOIN ( SELECT Quest, COUNT(DISTINCT Question) AS Solved FROM Solutions WHERE Team = ? AND Question <> 0 GROUP BY Quest ) SolvedQuestions ON QuestQuestions.QuestId = SolvedQuestions.Quest ) ON SolvedQuestions.Quest = Quests.Id ) ORDER BY SolvedQuestions.Solved",
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
        "SELECT TeamData.Name AS Name, TeamSolutions.Solved AS Solved FROM ( TeamData INNER JOIN ( SELECT Team, COUNT(DISTINCT Question) AS 'Solved' FROM Solutions WHERE Question <> 0 GROUP BY Team ) TeamSolutions ON TeamData.Id = TeamSolutions.Team ) ORDER BY TeamSolutions.Solved DESC LIMIT 10",
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
    let params = JSON.parse(req.body);
    getProfile(
      params.id_token, params.id_token_type,
      function(user) {
        base.maindb.query(
          //"SELECT Quests.Id, Quests.Name, Quests.Description, Questions.Count FROM Quests INNER JOIN Questions WHERE Quests.Id IN (SELECT Quests.Id FROM Quests INNERJOIN Solutions WHERE Solutions.User = ? AND Solutions.Quest = Quests.Id)"
        "SELECT Users.Name AS 'Name', COUNT(DISTINCT Solutions.Question) AS 'Solved' FROM Solutions, TeamData, Users WHERE Question <> 0 AND Solutions.Team = TeamData.Id AND TeamData.Type = 1 AND TeamData.Leader = Users.Id AND Users.Id IN ( SELECT UserA FROM Friends WHERE UserB = ? AND Accepted = 1 ) GROUP BY Users.Name LIMIT 10",
          function(err, sqlres) {
            //console.log(JSON.stringify(sqlres));
            //console.log(sqlres);
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
}
