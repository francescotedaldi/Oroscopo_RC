const express = require('express')
const router = express.Router()
var request = require('request')
const { ensureAuth } = require('../middleware/auth')

const Oroscopo = require('../models/horoscope')

//const {google} = require('googleapis');

var STRING_API = '';

var REFRESH_TOKEN = ''; //inserire da progetto Google #Francesco

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

    ////////////

    var option = {
      url: 'http://ohmanda.com/api/horoscope/' + oroscopo.segno
    }

    request.get(option, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        if (response.statusCode == 200) {
          lista = JSON.parse(body);
          console.log('\n\n\n!!!! STAMPO API di ' + oroscopo.segno + '!!!!\n\n\n');
          console.log(lista);
          oroscopo.oroscopo = lista.horoscope;
          STRING_API = lista.horoscope;
          console.log("\n\nora oroscopo è: \n")
          console.log(STRING_API);
          console.log('\n\n\n');
        }
      }
    })

    ///////////

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

//Creazione evento su Google Calendar
/*
router.post('/save/:id', async(req, res, next) => {
  try{
    const {title, body, segno, oroscopo, user, createdAt} = req.body;

    oauthToClient.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar('v3');

    const response = await calendar.events.insert({
      auth:
      calendarId:
      requestBody{
        summary: oroscopo.title;
        description: oroscopo.body + '\n\n' + oroscopo.oroscopo;
        location: 'Roma, Italy';
        colorId: '6';
        startDateTime: oroscopo.createdAt;
        endDateTime: oroscopo.createdAt;
      }
    })
  }catch(error){
    next(error);
  }
})
*/

/*
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
*/

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
