var mysql      = require('mysql');

module.exports = {
	database: function(hostp, userp, passwordp, databasep) {
		this.db = mysql.createConnection({
		  host     : host,
		  user     : userp,
		  password : passwordp,
		  database : databasep
		});
		this.callbackreformat = function(callbackf, error, results, additional) {
			results.lastID = results.insertId;
			callbackf(error, results);
		}
		this.formatparam = function(params) {
			if(params && (params != undefined)) {
				if(!Array.isArray(params)) {
					params = [].concat(params);
				}//[val] [vals] [[vals][..]]
				if(params.length) {
					if(!Array.isArray(params[0])) {
						params = [params];
					}
				} else {
					params=[[]]
				};
			} else {
				params=[[]];
			}
			return params;
		}
		this.rquery = function(query, callback, params) { //Array[Array] for rows of params, Array for params, value for one param, nothing for normal statement.
			params = this.formatparam(params);
			for(var i=0;i<params.length;i++) {
				//console.log(params[i]);
				db.query(query, params[i], callback);
			}
			//this.db.close();
		};
		this.query = this.rquery; //SAFE TO USE, all the same :P
		this.wquery = this.rquery;
}
