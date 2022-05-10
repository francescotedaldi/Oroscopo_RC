// richiedi libreria dotenv: la usiamo per non caricare su github le nostre info sensibili come key personali
//.config serve per specificare che metti le tue info sensibili in quel path
require('dotenv').config({ path: '/Users/phoenixstudio/Documents/GitHub/RC_teddy_millo/DATI_SENSIBILI.env' })

// il file .env è così strutturato
// GOOGLE_KEY=yyyyyyyyyyyyyyyyyyyyyyyyyyyyy

var request = require('request');
var document = "static/index.html";
var oroscopoRichiesto = document.get("secgli_segno");

// options contiene l'url con l'api
var url = 'http://ohmanda.com/api/horoscope/' + oroscopoRichiesto;
console.log("\nURL: " + url + "\n\n");

function callback(error, response, body) {

  if (!error && response.statusCode == 200) {

    console.log("\n\n !!! ############################### !!!\n\n");
    var jsonContent = JSON.parse(body);

    console.log(jsonContent);
    var testoOroscopo = jsonContent.horoscope;

    console.log("\n\nSOLO OROSCOPO: \n" + testoOroscopo);

    console.log("\n\n !!! ############################### !!!\n\n\n\n");

  }
}

request.get(url, callback);
