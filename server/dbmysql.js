var mysql      = require('mysql');

module.exports = {
	database: function(hostp, userp, passwordp, databasep) {
		//console.log(passwordp);
		this.db = mysql.createConnection({
		  host     : hostp,
		  user     : userp,
		  password : passwordp,
		  database : databasep
		});
		this.callbackreformat = function(callbackf, error, results, additional) {
			console.log(results);
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
			var self = this;
			for(var i=0;i<params.length;i++) {
				//console.log(params[i]);

				this.db.query(query, params[i],
					function(err, res, add) {
						//console.log(err);
						self.callbackreformat(callback, err, res, add);
					}
				);
			}
			//this.db.close();
		};
		this.query = this.rquery; //SAFE TO USE, all the same :P
		this.wquery = this.rquery;
	}
}
