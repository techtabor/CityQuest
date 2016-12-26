var fs = require("fs");
//var file = "test.db";
//var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();

module.exports = {
	database: function(file) {
		this.db = new sqlite3.Database(file);
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
			this.db.serialize(function() {
				var stmt = this.prepare(query);
				for(var i=0;i<params.length;i++) {
					console.log(params[i]);
					stmt.all.apply(stmt, params[i].concat(callback));
				}
				stmt.finalize();
			});
			//this.db.close();
		};
		this.query = this.rquery; //WARNING: DO NOT USE
		this.wquery = function(query, callback, params) { //Array[Array] for rows of params, Array for params, value for one param, nothing for normal statement.
			params = this.formatparam(params);
			this.db.serialize(function() {
				var stmt = this.prepare(query);
				for(var i=0;i<params.length;i++) {
					stmt.run(params[i], callback);
				}
				stmt.finalize();
			});
			//this.db.close();
		};
		this.close = function() {
			this.db.close();
		};
	}
}
