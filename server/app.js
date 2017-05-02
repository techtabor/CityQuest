
var dbapi = require('./dbmysql.js');
var maindb;
var logindb;

var http = require('http');
var httpdispatcher = require('./httpdispatcher.js');
var dispatcher = new httpdispatcher();
var fs = require("fs");

require('./login.js')();
require('./stats.js')();
require('./quest.js')();
require('./team.js')();
require('./friends.js')();
var base = require('./base.js');

//Lets define a port we want to listen to
const PORT = 2017;

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
  base.maindb = new dbapi.database("89.147.123.227", process.argv[2], process.argv[3], "Main", process.argv[4]);

  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});

dispatcher.setStatic('/static');
dispatcher.setStaticDirname('static');

dispatcher.beforeFilter(/\//, function(req, res, chain) {
  res.writeHead(200, base.head);
  chain.next(req,res,chain);
});

dispatcher.onOptions(/\//, function(req, res) {
  res.writeHead(200, base.head);
  res.end();
});

dispatcher.onPost("/Log", function(req, res) {
  console.log(req.params);
});

dispatcher.onPost("/GetAllQuestions", GetAllQuestions);

dispatcher.onPost("/GetQuestHeader", GetQuestHeader);

dispatcher.onPost("/SubmitQuestionSolution", SubmitQuestionSolution);

dispatcher.onPost("/GetOneQuestion", GetOneQuestion);

dispatcher.onPost("/GetSuggestions", GetSuggestions);

dispatcher.onPost("/Create", Create);

dispatcher.onPost("/GetPlayedStats", GetPlayedStats);

dispatcher.onPost("/GetGlobalStats", GetGlobalStats);

dispatcher.onPost("/GetFriendStats", GetFriendStats);

dispatcher.onPost("/LoginPairCode", LoginPairCode);

dispatcher.onPost("/LoginPairResp", LoginPairResp);

dispatcher.onPost("/LoginPairCheck", LoginPairCheck);

dispatcher.onPost("/CreateTeam", CreateTeam);

dispatcher.onPost("/GetTeamMembers", GetTeamMembers);

dispatcher.onPost("/GetTeams", GetTeams);

dispatcher.onPost("/LeaveTeam", LeaveTeam);

dispatcher.onPost("/SetTeam", SetTeam);

dispatcher.onPost("/AddFriend", AddFriend);

dispatcher.onPost("/GetFriends", GetFriends);

dispatcher.onPost("/GetFriendRequests", GetFriendRequests);

dispatcher.onPost("/ConfirmRequest", ConfirmRequest);

dispatcher.onPost("/RemoveFriend", RemoveFriend);

dispatcher.onPost("/VerifyLogin", VerifyLogin);
