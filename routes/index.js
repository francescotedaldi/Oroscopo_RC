const express = require('express')
var request = require('request');
const router = express.Router()

// prendi le funzioni per il corretto redirecting
const { ensureAuth, ensureGuest } = require('../middleware/auth')


var scegnoScelto = 'aries'
var urlApi = process.env.URL_API + scegnoScelto


// @desc    Login/Landing page
// @route   GET /
// solo chi non è loggato dovrebbe vederlo (ensureGuest)
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc    Dashboard
// @route   GET /dashboard
// solo chi è loggato dovrebbe vederlo (ensureAuth)
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log("\nsi è loggato:\n")
    console.log(req.user)

    console.log("\n\n!!! stampo urlApi: !!!")
    console.log(urlApi)
    res.render('dashboard', {
        name: req.user.firstName,
    })
})



////////////    PRENDI E STAMPA LE API

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonContent = JSON.parse(body);
        var info_api = JSON.stringify(jsonContent);

       console.log("\n\n!!! STAMPO API: !!!\n\n" + info_api + "\n\n");
    }
}

request.get(urlApi, callback);

////////////////////////////////////////



module.exports = router
