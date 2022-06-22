const app = require('../app');
const request = require('request');
const express = require('express');
const horoscope = require('../models/horoscope');


var scegnoScelto = 'aquarius';
var urlApi = process.env.URL_API + scegnoScelto;

function ApiManager() {
    function getApi(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonContent = JSON.parse(body);
            //console.log("\n\n!!! getApi: !!!\n\n");
            //console.log(jsonContent);
            var info_api = JSON.stringify(jsonContent);     //json to string
            //console.log("\n\n\n");
            alert(jsonContent);
        }
    }
    request.get(urlApi, getApi);
}
