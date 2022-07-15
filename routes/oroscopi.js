const express = require('express')
const router = express.Router()
var request = require('request')
const { ensureAuth } = require('../middleware/auth')
const Oroscopo = require('../models/horoscope')
const {google} = require('googleapis');

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

    console.log('\n\n\n')

    await Oroscopo.create(req.body)
    res.redirect('/dashboard')

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all oroscopi
// @route   GET /oroscopi
router.get('/', ensureAuth, async (req, res) => {
  try {
    const oroscopi = await Oroscopo.find({})
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('oroscopi/index', {
      oroscopi,
    })
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

    /////// Prendo API - Creo evento in Google Calendar///////

    var urlApi = {
      url: 'http://ohmanda.com/api/horoscope/' + oroscopo.segno
    }
    
    function callback(error, response, body) {
      var jsonContent = JSON.parse(body);
      var info_api = JSON.stringify(jsonContent.horoscope);
      oroscopo.oroscopo = info_api;
      
      const calendar = google.calendar({ version: 'v3' });
    
      const description = oroscopo.body + '\n\n' + oroscopo.oroscopo;
      const eventStartTime = new Date();
      const eventEndTime = new Date();

      calendar.events.insert({
        oauth_token: req.session.accessToken,
        calendarId: 'primary',
        requestBody: {
          summary: oroscopo.title,
          description: description,
          location: 'Rome, Italy',
          colorId: '6',
          start: {
            dateTime: eventStartTime,
            timeZone: "Europe/Rome",
          },
          end: {
            dateTime: eventEndTime,
            timeZone: "Europe/Rome",
          },
        }
      })
    }
    request.get(urlApi.url, callback);
    console.log("Evento salvato in Google Calendar");
    ///////// Fine Prendo API - Creo evento in Google Calendar /////////

    if (oroscopo.user != req.user.id) {
      res.redirect('/oroscopi')
    }
    else {
    
      res.render('oroscopi/save', {
        oroscopo,
      })
    }

  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    Update oroscopo
// @route   PUT /oroscopi/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let oroscopo = await Oroscopo.findById(req.params.id).lean()

    if (!oroscopo) {
      return res.render('error/404')
    }

    if (oroscopo.user != req.user.id) {
      res.redirect('/oroscopi')
    } else {
      oroscopo = await Oroscopo.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
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
