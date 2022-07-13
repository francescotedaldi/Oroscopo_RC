const express = require('express')
var request = require('request');
const router = express.Router()


// prendi le funzioni per il corretto redirecting
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Oroscopo = require('../models/horoscope');


// @desc    Login/Landing page
// @route   GET /
// solo chi non è loggato dovrebbe vederlo (ensureGuest)
router.get('/', ensureGuest, (req, res) => {

    res.render('login', {
        layout: 'login',
    })
})

// @desc    About Us
// @route   GET /about_us
// solo chi è loggato dovrebbe vederlo (ensureAuth)
router.get('/aboutus', ensureAuth, async (req, res) => {
    res.render('about_us')
})

// @desc    Dashboard
// @route   GET /dashboard
// solo chi è loggato dovrebbe vederlo (ensureAuth)
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {

        console.log('\n----------------> /DASHBOARD req.session\n')
        console.log(req.session)
        console.log("ACCESS TOKEN: " + req.session.accessToken)
        console.log("REQUEST TOKEN: " + req.session.refreshToken)
        console.log("\n ------------------------- \n\n\n");

        // con lean() dovinetano oggetti js, non mongoosedocuments
        const oroscopi = await Oroscopo.find({ user: req.user.id }).lean()

        console.log('\n\n\n----------------> /DASHBOARD si è loggato: \n\n')
        console.log(req.user);
        console.log('\n----------------> /DASHBOARD stampo gli oroscopi di ' + req.user.firstName + '\n\n')
        console.log(oroscopi)
        console.log("\n ------------------------- \n\n\n\n\n\n");

        res.render('dashboard', {
            name: req.user.firstName,
            oroscopi,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router
