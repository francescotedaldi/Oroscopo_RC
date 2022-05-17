const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Oroscopo = require('../models/horoscope')

// @desc    Show add page
// @route   GET /oroscopi/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('oroscopi/add')
  })

module.exports = router
