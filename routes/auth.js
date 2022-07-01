const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')  //prende i dati utente
const pp = require('../config/passport')


// @desc    Auth with Google
// @route   GET /auth/google

// ---> 'https://www.googleapis.com/auth/drive.file'  || 'profile' <---
router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/calendar' , 'https://www.googleapis.com/auth/userinfo.profile' , 'https://www.googleapis.com/auth/userinfo.email'] }))


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(passport.res)
    res.redirect('/dashboard')
  }
)

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router

