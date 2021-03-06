/* 
mysql://b29f1406200b9a:db4f7bf0@us-cdbr-east-03.cleardb.com/heroku_e8d6db0c15d4372?reconnect=true
*/

const mysql = require('mysql2');
const http = require('http');

const port = process.env.PORT || 3000;

// const dbConfig = {
// 	host: "localhost",
// 	user: "root",
// 	password: "supernova",
// 	database: "test_data_constraints_o_miceli",
// 	port: '3306',
// 	multipleStatements: false,
// 	reconnect: true
// }

let dbConfig;
if (process.env.IS_HEROKU != 1) {
	dbConfig = {
	host: "localhost",
	user: "root",
	password: "supernova",
	database: "test_data_constraints_o_miceli",
	port: '3306',
	multipleStatements: false,
	reconnect: true
	};
	console.log('not heroku');
}  else if (process.env.IS_HEROKU == 1) {
	dbConfig = {
		host: "us-cdbr-east-03.cleardb.com",
		user: "b29f1406200b9a",
		password: "db4f7bf0",
		database: "heroku_e8d6db0c15d4372",
		multipleStatements: false,
		reconnect: true
	};
	console.log('heroku');
} else {
	console.log('not connected to host');
}


var database = mysql.createPool(dbConfig);

database.getConnection((err, dbConnection) => {
	if (!err) {
		console.log("Successfully connected to MySQL");
	}
	else {
		console.log("Error Connecting to MySQL");
		console.log(err);
	}
});


http.createServer(function(req, res) {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			//Send an HTTP Status code of 500 for server error.
			res.writeHead(500, {'Content-Type': 'text/html'});
			//write the HTML
			res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
			console.log("Error connecting to mysql");
		}
		else {
			dbConnection.query("SHOW VARIABLES LIKE 'version';", (err, result) => {
				if (err) {
					//Send an HTTP Status code of 500 for server error.
					res.writeHead(500, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					//Send an HTTP Status code of 200 for success!
					res.writeHead(200, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Connected to the database, check the Heroku logs for the results.</div></body></html>');

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
}).listen(port);

