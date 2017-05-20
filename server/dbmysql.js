var mysql      = require('mysql');

module.exports = {
	database: function(hostp, userp, passwordp, databasep, portp) {
		this.db = mysql.createConnection({
		  host     : hostp,
			port     : portp,
		  user     : userp,
		  password : passwordp,
		  database : databasep
		});
		//console.log(this.db);
		this.callbackreformat = function(callbackf, error, results, additional) {
			if(!error) {
				//console.log(results);
				//results.lastID = results.insertId;
				callbackf(false, results);
			} else {
				console.log("-----------------------SQL Error------------------------");
				console.log(error);
				callbackf(true, results);
			}

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
