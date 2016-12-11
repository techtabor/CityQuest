var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();

module.exports = {
	query: function(query, callback, params) { //Array[Array] for rows of params, Array for params, value for one param, nothing for normal statement.
		var res = [];
		var db = new sqlite3.Database(file);
		if(params && (params != undefined)) {
			params = [].concat(params);
			if(params.length==1) {
				params[0] = [].concat(params[0]);
			}
		} else {
			params=[[]];
		}
		
		db.serialize(function() {
			var stmt = db.prepare(query);
			for(var i=0;i<params.length;i++) {
				stmt.all.apply(stmt, params[i].concat(callback));
			}
			stmt.finalize();
		});
		db.close();
		return res;
	}
}