const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
// https://www.googleapis.com/auth/drive || profile
router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/drive'] }))


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
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
