var express = require('express');
var app = express();
var uaParser = require('ua-parser-js');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))



app.get('/', function(request, response) {
  let responseData = [];
  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);

  responseData.push(request.headers['x-forwarded-for']);


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://herokuDeeplink:test12345@testdeeplink-nu9zm.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  response.send(collection.collectionName);
  // perform actions on the collection object
  client.close();
});



  //response.send(responseData);
})

app.get('/hello', function(request, response) {
  var id = request.query.id;
  response.send("Hello " + id );
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})