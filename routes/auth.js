const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')  //prende i dati utente
const pp = require('../config/passport')


// @desc    Auth with Google
// @route   GET /auth/google
/*
  ---> 'https://www.googleapis.com/auth/drive.file' <---
Visualizzare, modificare, creare ed eliminare soltanto i file di Google Drive specifici che usi con questa app

---> 'profile' <---
Accede solo all' account, non da mai problemi
*/
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


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

