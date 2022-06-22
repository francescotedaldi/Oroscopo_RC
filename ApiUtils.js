function ApiManager(scegnoScelto) {

    const app = require('./app');
    const request = require('request');

    var urlApi = process.env.URL_API + scegnoScelto

    function getApi(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonContent = JSON.parse(body);
            console.log("\n\n!!! getApi: !!!\n\n");
            console.log(jsonContent);

            var info_api = JSON.stringify(jsonContent);     //json to string
            console.log("\n\n\n");
        }
    }
    request.get(urlApi, getApi);
}
