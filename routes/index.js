const express = require('express')
const router = express.Router()

// prendi le funzioni per il corretto redirecting
const { ensureAuth, ensureGuest } = require('../middleware/auth')


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


module.exports = router
