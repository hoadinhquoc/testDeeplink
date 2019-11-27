var express = require('express');
var app = express();
var uaParser = require('ua-parser-js');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

const MongoClient = require('mongodb').MongoClient;
//Config
const uri = "mongodb+srv://herokuDeeplink:test12345@testdeeplink-nu9zm.mongodb.net/test?retryWrites=true&w=majority";
const DB_NAME = "project_k";
const COLLECTION_NAME = "users_data";

const TOY_ID_LIST = ["VV114", "VV200"];
//////////

app.get('/:id', function(request, response) {
  let id = request.params.id;

  let isToyID = TOY_ID_LIST.includes(id);
  let resString = "Redirect to another URL!!!";
  if(isToyID)
  {
    resString = "You have toy " + id;
  }
  response.send(resString);
});

app.get('/saveID/:id', function(request, response) {
  let id = request.params.id;

  let isToyID = TOY_ID_LIST.includes(id);

  if(!isToyID) response.send("WRONG TOY ID!!!");

  let responseData = [];
  let userData = {time: Date.now(),ip: request.headers['x-forwarded-for']};
  responseData.push(request.headers['x-forwarded-for']);

  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);
  responseData.push(ua);
  userData.device = ua.device;
  userData.os = ua.os;
  userData.toyID = id;

  console.log(JSON.stringify(userData));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);

    dbo.collection(COLLECTION_NAME).insertOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      response.send("Data insert SUCCESS: " + JSON.stringify(userData));

      db.close();

    });
  });
});

app.get('/app/checkGift', function(request, response) {
  
  let responseData = [];
  let userData = {ip: request.headers['x-forwarded-for']};
  responseData.push(request.headers['x-forwarded-for']);

  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);
  responseData.push(ua);
  userData.device = ua.device;
  userData.os = ua.os;

  console.log(JSON.stringify(userData));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);

    dbo.collection(COLLECTION_NAME).findOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      response.send("Data load SUCCESS: " + JSON.stringify(result.toyID));

      dbo.collection(COLLECTION_NAME).deleteOne({_id:result._id},(err, obj)=>{

        if (err) throw err;
        
        db.close();
      });

    });
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})