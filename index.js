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
  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);
  responseData.push(ua);
  responseData.push(request.headers['x-forwarded-for']);

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sample_training");
    dbo.collection("stories").findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.name);

      responseData.push(JSON.stringify(result));

      response.send(responseData);
      db.close();
    });
  });
})

app.get('/hello', function(request, response) {
  var id = request.query.id;
  response.send("Hello " + id );
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})