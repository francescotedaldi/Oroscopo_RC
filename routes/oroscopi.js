const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Oroscopo = require('../models/horoscope')


// @desc    Show add page
// @route   GET /oroscopi/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('oroscopi/add')
})

// @desc    Process add form
// @route   POST /oroscopi
router.post('/', ensureAuth, async (req, res) => {
  try {

    // req.body ci da i dati che arrivano dalla form
    req.body.user = req.user.id
    await Oroscopo.create(req.body)
    res.redirect('/dashboard')

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
module.exports = router
