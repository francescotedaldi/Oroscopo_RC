// https://expressjs.com/
// npm install express

// express fa mashup: prende info in giro
// così ho invocato il metodo che fa il protocollo per me
var express = require('express');
var app = express();

// Test con POSTMAN o CURL
// CURL https://curl.haxx.se/

// curl localhost:8888

app.get('/', function (req, res) {
  res.send('Sono il root!!!');
});

// curl -X GET http://localhost:8888/prima_risorsa_get

app.get('/prima_risorsa_get', function (req, res) {
  res.send('sono la prima risorsa GET su questo server');
});

app.get('/stessa_risorsa', function (req, res) {
  res.send('sono la stessa_risorsa acceduta in GET');
});

app.get('/stato_server', function (req, res) {
  res.send('nodo: ' + process.env.NODE_ENV + '  istanza: ' + process.env.INSTANCE + '  porta: ' + process.env.PORT);
});

app.post('/stessa_risorsa', function (req, res) {
  res.send('sono la stessa_risorsa acceduta in POST');
});

app.get('/seconda_risorsa_get', function (req, res) {
  res.send('sono la seconda risorsa GET su questo server');
});

// curl -X POST http://localhost:8888/prima_risorsa_post
app.post('/prima_risorsa_post', function (req, res) {
  res.send('sono la prima risorsa POST su questo server');
});


var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
