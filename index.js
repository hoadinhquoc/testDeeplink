var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  let responseData = [];
  responseData.push(request.headers);
  responseData.push(request.rawHeaders);
  responseData.push(request.ip);
  responseData.push(request.get('User-Agent'));
  response.send(responseData);
})

app.get('/hello', function(request, response) {
  var id = request.query.id;
  response.send("Hello " + id );
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})