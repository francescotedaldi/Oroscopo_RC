const express = require('express');
const request = require('request');
const dotenv = require('dotenv')

var segnoZodiacale = ['aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn'];
var Oroscopi = [];
var urlApi = '';
var SEGNO_SCELTO = '';

function getSegnoScelto() {

    var myNodelist = document.getElementById("segno");
    document.getElementsByName("segno").innerHtml = myNodelist;
    SEGNO_SCELTO = myNodelist.value;

    var apiss = getApiSegnoScelto(SEGNO_SCELTO);

    alert("getSegnoScelto: " + SEGNO_SCELTO);
}

/////////////   API    /////////////////////////////////////////////////////

var i = 0;

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonContent = JSON.parse(body);
        console.log('\nstampo !!! CALLBACK !!! : \n');
        console.log(jsonContent);
        var info_api = JSON.stringify(jsonContent);     //json to string
        Oroscopi[i] = jsonContent;
    }
}

for (i; i < segnoZodiacale.length; i++) {
    urlApi = '';
    urlApi = 'http://ohmanda.com/api/horoscope/' + segnoZodiacale[i];
    console.log('\nVado a prendere !!! urlApi !!! : ' + urlApi);
    request.get(urlApi, callback);
}

function getApiSegnoScelto(segnoScelto){
    var j = 0;

    for (j; j < segnoZodiacale.length; j++) {
        if (segnoScelto == segnoZodiacale[j]){
            alert(Oroscopi[j]);
            return Oroscopi[j];
        }
    }

    return;
}

  /////////////  fine API ///////////////////////////////////////////////////