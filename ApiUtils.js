/*
const app = require('./app');

function getApi() {
    const request = require('request');

    var scegnoScelto = 'aquarius';
    var urlApi = process.env.URL_API + scegnoScelto;

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonContent = JSON.parse(body);
            console.log("\n\n!!! getApi: !!!\n\n");
            console.log(jsonContent);
            var info_api = JSON.stringify(jsonContent);     //json to string
            console.log("\n\n\n");
        }
    }

    request.get(urlApi, callback);
}
*/