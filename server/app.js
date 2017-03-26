
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
  maindb = new dbapi.database("localhost", "system", process.argv[2], "Main");

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

dispatcher.onPost("/VerifyLogin", VerifyLogin);
