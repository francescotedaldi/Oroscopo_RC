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

// @desc    Show single oroscopo
// @route   GET /oroscopi/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let oroscopo = await Oroscopo.findById(req.params.id).populate('user').lean()

    if (!oroscopo) {
      return res.render('error/404')
    }

    if (oroscopo.user._id != req.user.id) {
      res.render('error/404')
    } else {
      res.render('oroscopi/show', {
        oroscopo,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show save page
// @route   GET /oroscopi/save/:id
router.get('/save/:id', ensureAuth, async (req, res) => {
  
  try {
    const oroscopo = await Oroscopo.findOne({
      _id: req.params.id,
    }).lean()

    if (!oroscopo) {
      return res.render('error/404')
    }

    if (oroscopo.user != req.user.id) {
      res.redirect('/oroscopi')
    } else {
      res.render('oroscopi/save', {
        oroscopo,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete oroscopo
// @route   DELETE /oroscopi/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let oroscopo = await Oroscopo.findById(req.params.id).lean()

    if (!oroscopo) {
      return res.render('error/404')
    }

    if (oroscopo.user != req.user.id) {
      res.redirect('/oroscopi')
    } else {
      await Oroscopo.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
module.exports = router
