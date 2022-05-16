const express = require('express')
var request = require('request');
const router = express.Router()

// prendi le funzioni per il corretto redirecting
const { ensureAuth, ensureGuest } = require('../middleware/auth')

var scegnoScelto = 'aquarius'
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

    res.render('dashboard', {
        name: req.user.firstName,
    })
})



////////////    PRENDI E STAMPA LE API

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var jsonContent = JSON.parse(body);
        console.log("\n\n!!! STAMPO API: !!!\n\n");
        console.log(jsonContent);

        var info_api = JSON.stringify(jsonContent);     //json to string
        console.log("\n\n\n");
    }
}

request.get(urlApi, callback);

////////////////////////////////////////

module.exports = router
