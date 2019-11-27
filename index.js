var express = require('express');
var app = express();
var uaParser = require('ua-parser-js');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://herokuDeeplink:test12345@testdeeplink-nu9zm.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });



app.get('/', function(request, response) {
  let responseData = [];
  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);

  responseData.push(request.headers['x-forwarded-for']);

  //response.send(responseData);
  client.connect(err => {
    console.log(JSON.stringify(err));
    responseData.push(JSON.stringify(err));
  
    const db = client.db("sample_training");
    const collection = db.collection("stories");
  
    //let dataPiece = collection.findOne( {id: "19970068"}, (err, result)=>{
    let dataPiece = collection.findOne();
  
    console.log(JSON.stringify(dataPiece));
    responseData.push(JSON.stringify(dataPiece));
    responseData.push(dataPiece.description);
    response.send(responseData);
    client.close();
  });
})

app.get('/hello', function(request, response) {
  var id = request.query.id;
  response.send("Hello " + id );
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})