var express = require('express');
var app = express();
var uaParser = require('ua-parser-js');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://herokuDeeplink:test12345@testdeeplink-nu9zm.mongodb.net/test?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useUnifiedTopology: true });

app.get('/', function(request, response) {
  let responseData = [];
  let userData = {time: Date.getMilliseconds(),ip: request.headers['x-forwarded-for']};
  responseData.push(request.headers['x-forwarded-for']);

  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);
  responseData.push(ua);
  userData.device = ua.device;
  userData.os = ua.os;

  console.log(JSON.stringify(userData));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("project_k");

    dbo.collection("users_data").insertOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      response.send("Data insert SUCCESS: " + JSON.stringify(userData));

      db.close();

    });
    /*dbo.collection("users_data").findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.name);

      responseData.push(JSON.stringify(result));

      response.send(responseData);
      db.close();
    });*/
  });
})

app.get('/hello', function(request, response) {
  var id = request.query.id;
  response.send("Hello " + id );
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})