var db = require('./db.js');
var dispatcher = require('httpdispatcher');


function cb(err, res) {
	console.log(res);
}
/*
//fooldal
app.get('/', function (req, res) {
    console.log('request homera');
    db.query("SELECT * FROM Asd WHERE Test<=(?)", cb, [[5],[8],[48]]);
	res.end();
});


app.listen(2017, function () {
    console.log('Elindult a szerver');
});*/

var http = require('http');

//Lets define a port we want to listen to
const PORT=2017; 

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//For all your static (js/css/images/etc.) set the directory name (relative path).
//dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});