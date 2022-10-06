// load the http module
const fs = require('fs');
var http = require('http');
const url = require('url');

// configure our HTTP server
var server = http.createServer(function (request, response) {
  const queryObject = url.parse(request.url, true).query;
   let mysql = require('mysql');
   let connection = mysql.createConnection({
     host: 'xxxx.xxxx.eu-west-1.rds.amazonaws.com',
     port:  '3306',
     user: 'root',
     password: 'db_pass',
     database: 'db_name',
     ssl: {
       ca: fs.readFileSync(__dirname + "/rds-ca-2019-root.cer").toString()
     },
     synchronize: true
   });

   let createRequester = `create table if not exists requests(
                           id int primary key auto_increment,
                           requester varchar(255) not null,
                           request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                       )`;

   connection.query(createRequester, function(err, results, fields) {
     if (err) {
       console.log(err.message);
     }
   });

   response.writeHead(200, {"Content-Type": "text/plain"});
   response.end("Hello from "+queryObject['name']+".\n");
   if (queryObject['name']){
     console.log('going to insert '+queryObject['name'])
     let insertRequester = `insert into requests (requester) values (?);`;
     connection.query(insertRequester,[queryObject['name']], function (err, result) {
       if (err) throw err;
       console.log("Number of records inserted: " + result.affectedRows);
     });
   }
  connection.end();

});

// listen on localhost:8000
server.listen(8000);
console.log("Server listening at http://127.0.0.1:8000/");
