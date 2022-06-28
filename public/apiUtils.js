const request = require('request');
const dotenv = require('dotenv');

const segnoZodiacale = ['aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn'];
var Oroscopi = [];
var urlApi = '';
var SEGNO_SCELTO = '';

/////////////   API    /////////////////////////////////////////////////////

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonContent = JSON.parse(body);
        var info_api = JSON.stringify(jsonContent);     //json to string
        Oroscopi.push(jsonContent);
    }

    if (Oroscopi.length == 12) {
        for (var i = 0; i < Oroscopi.length; i++) {
            console.log("---> i: " + i + "\n\nsegno: " + Oroscopi[i].sign + "\ndata: " + Oroscopi[i].date + "\noroscopo: " + Oroscopi[i].horoscope + "\n\n");
        }
        console.log('\n\n!!!! OROSCOPI CARICATO !!!!\n\n');
    }

}

var COUNTER = 0;

for (COUNTER; COUNTER < segnoZodiacale.length; COUNTER++) {
    urlApi = '';
    urlApi = 'http://ohmanda.com/api/horoscope/' + segnoZodiacale[COUNTER];
    request.get(urlApi, callback);
}

/////////////  fine API ///////////////////////////////////////////////////

function StampaOroscopoSS(segno_scelto) {

    alert("StampaOroscopoSS: SS - " + SEGNO_SCELTO + "\nss - " + segno_scelto + "\nOroscopi: " + Oroscopi);

    /*
    if (Oroscopi.length == 12) {
        for (i = 0; i < Oroscopi.length; i++) {
            console.log("segno: " + Oroscopi[i].sign + "\ndata: " + Oroscopi[i].date + "\noroscopo: " + Oroscopi[i].horoscope + "\n\n\n\n");
        }
    }
    */
}

function getSegnoScelto() {

    var myNodelist = document.getElementById("segno");
    document.getElementsByName("segno").innerHtml = myNodelist;
    SEGNO_SCELTO = myNodelist.value;

    StampaOroscopoSS(SEGNO_SCELTO);

    alert("getSegnoScelto: " + SEGNO_SCELTO);
}