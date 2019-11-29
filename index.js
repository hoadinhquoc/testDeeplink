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

  userData.vendor = ua.device.vendor && ua.device.vendor.toLowerCase();
  userData.model = ua.device.model && ua.device.model.toLowerCase();
  userData.os = ua.os.name && ua.os.name.toLowerCase();
  userData.osversion = ua.os.version && ua.os.version.toLowerCase();

  userData.toyID = id.toLowerCase();

  console.log(JSON.stringify(userData));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);

    dbo.collection(COLLECTION_NAME).insertOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      response.send("Data insert SUCCESS: " + JSON.stringify(userData) + " **** " + JSON.stringify(responseData));

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

  let appHeader = {//vendor: request.headers["vendor"] && request.headers["vendor"].toLowerCase(),
                  model: request.headers["model"] && request.headers["model"].toLowerCase(),
                  osversion: request.headers["os-version"] && request.headers["os-version"].toLowerCase()};
  appHeader.ip = request.headers['x-forwarded-for'];

  userData = appHeader;

  console.log(JSON.stringify(appHeader));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);

    dbo.collection(COLLECTION_NAME).findOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      if(result)
      {
        //response.send("Data load SUCCESS: " + JSON.stringify(result.toyID));
        response.redirect("fb:/profile/DungKhocOSaiGon");
        dbo.collection(COLLECTION_NAME).deleteOne({_id:result._id},(err, obj)=>{

          if (err) throw err;
          
          db.close();
        });
      }
      else
      {
        //response.send("No record found");
        response.redirect("fb:/profile/DungKhocOSaiGon");
      }
    });
  });
});

app.get('/app/checkGiftv2', function(request, response) {
  
  let responseData = [];
  let userData = {ip: request.headers['x-forwarded-for']};
  responseData.push(request.headers['x-forwarded-for']);

  responseData.push(request.headers);
  let ua = uaParser(request.headers['user-agent']);
  responseData.push(ua);
  userData.device = ua.device;
  userData.os = ua.os;

  console.log(JSON.stringify(userData));

  let appHeader = {//vendor: request.headers["vendor"] && request.headers["vendor"].toLowerCase(),
                  model: request.headers["model"] && request.headers["model"].toLowerCase(),
                  osversion: request.headers["os-version"] && request.headers["os-version"].toLowerCase()};
  appHeader.ip = request.headers['x-forwarded-for'];

  userData = appHeader;

  console.log(JSON.stringify(appHeader));

  MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);

    dbo.collection(COLLECTION_NAME).findOne(userData, (err, result)=>{

      if(err) response.send(JSON.stringify(err));

      if(result)
      {
        response.send("Data load SUCCESS: " + JSON.stringify(result.toyID));
        //response.redirect("fb://profile/DungKhocOSaiGon");
        dbo.collection(COLLECTION_NAME).deleteOne({_id:result._id},(err, obj)=>{

          if (err) throw err;
          
          db.close();
        });
      }
      else
      {
        response.send("No record found");
        //response.redirect("fb://profile/DungKhocOSaiGon");
      }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})