const express = require('express')
var request = require('request');
const router = express.Router()

/*
 * @api {get} /login Get logins
 * @apiName GetLogin
 * @apiGroup Login
 */

const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Oroscopo = require('../models/horoscope');


// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {

    res.render('login', {
        layout: 'login',
    })
})

// @desc    About Us
// @route   GET /about_us
router.get('/aboutus', ensureAuth, async (req, res) => {
    res.render('about_us')
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {

        const oroscopi = await Oroscopo.find({ user: req.user.id }).lean()

        console.log('\n\n\n----------------> /DASHBOARD si è loggato: \n\n')
        console.log(req.user);
        console.log('\n----------------> /DASHBOARD stampo i diari di ' + req.user.firstName + '\n\n')
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
