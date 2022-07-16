const express = require('express')
const router = express.Router()
var request = require('request')
const { ensureAuth } = require('../middleware/auth')
const Oroscopo = require('../models/horoscope')
const {google} = require('googleapis');




router.get('/add', ensureAuth, (req, res) => {
  res.render('oroscopi/add')
})

/**
 * @api {post} /oroscopi Post single oroscopo
 * @apiName PostOroscopo
 * @apiGroup Oroscopi
 * @apiSuccess {json} returns the newly created post
 * @apiSuccessExample {json} Success-Response:
 * 
 * HTTP/1.1 200 OK
 * 
 * {
 *   _id: new ObjectId("62d18b07ad65ca40e349ffe0"),
 *   title: 'title_example',
 *   body: '<p>body_example</p>,
 *   segno: 'cancer',
 *   user: new ObjectId("62c2b71221c49f5f1c0335f0"),
 *   createdAt: 2022-07-15T15:43:03.852Z,
 *   __v: 0
 * }
 * 
 * @apiError OroscopeNotFound The Id of the oroscope is not found.
 *
 * @apiErrorExample Error-Response:
 * 
 * HTTP/1.1 404 Not Found
 * 
 * {
 *   "error": "OroscopeNotFound"
 * }
 */

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

/**
 * @api {get} /oroscopi Get all oroscopi
 * @apiName GetOroscopi
 * @apiGroup Oroscopi
 * @apiSuccess {json} returns all the posts in the database
 * @apiSuccessExample {json} Success-Response:
 * 
 * HTTP/1.1 200 OK
 * 
 * {
 *   _id: new ObjectId("62d18b07ad65ca40e349ffe0"),
 *   title: 'title1_example',
 *   body: '<p>body1_example</p>,
 *   segno: 'cancer',
 *   user: new ObjectId("62c2b71221c49f5f1c0335f0"),
 *   createdAt: 2022-07-15T15:43:03.852Z,
 *   __v: 0
 * },
 * 
 * {
 *   _id: new ObjectId("74a44g78bg81hh12c099jja2"),
 *   title: 'title2_example',
 *   body: '<p>body2_example</p>,
 *   segno: 'gemini',
 *   user: new ObjectId("56u8k12769a71x1j7n7741x5"),
 *   createdAt: 2022-07-15T15:22:19.147Z,
 *   __v: 0
 * }
 * 
 * @apiError OroscopeNotFound The Id of the oroscope is not found.
 * 
 * @apiErrorExample Error-Response:
 * 
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "OroscopeNotFound"
 * }
 */

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

/**
 * @api {get} /oroscopi/:id Get single oroscopo
 * @apiName GetOroscopo
 * @apiGroup Oroscopi
 * @apiParam {Number} id post ID
 * @apiSuccess {json} returns a post made by the user specified in the user field in the response body
 * @apiSuccessExample {json} Success-Response:
 * 
 * HTTP/1.1 200 OK
 * 
 * {
 *   _id: new ObjectId("62d18b07ad65ca40e349ffe0"),
 *   title: 'title_example',
 *   body: '<p>body_example</p>,
 *   segno: 'cancer',
 *   user: new ObjectId("62c2b71221c49f5f1c0335f0"),
 *   createdAt: 2022-07-15T15:43:03.852Z,
 *   __v: 0
 * }
 * 
 * @apiError OroscopeNotFound The Id of the oroscope is not found.
 *
 * @apiErrorExample Error-Response:
 * 
 * HTTP/1.1 404 Not Found
 * 
 * {
 *   "error": "OroscopeNotFound"
 * }
 */

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


/**
 * @api {put} /oroscopi/:id Update single oroscopo
 * @apiName PutOroscopo
 * @apiGroup Oroscopi
 * @apiParam {Number} id post ID
 * @apiSuccess {json} returns the modified post
 * @apiSuccessExample {json} Success-Response:
 * 
 * HTTP/1.1 200 OK
 * 
 * {
 *   _id: new ObjectId("62d18b07ad65ca40e349ffe0"),
 *   title: 'title_example',
 *   body: '<p>body_example</p>,
 *   segno: 'cancer',
 *   user: new ObjectId("62c2b71221c49f5f1c0335f0"),
 *   createdAt: 2022-07-15T15:43:03.852Z,
 *   __v: 0
 * }
 * 
 * @apiError OroscopeNotFound The Id of the oroscope is not found.
 *
 * @apiErrorExample Error-Response:
 * 
 * HTTP/1.1 404 Not Found
 * 
 * {
 *   "error": "OroscopeNotFound"
 * }
 */

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


/**
 * @api {delete} /oroscopi/:id Delete single oroscopo
 * @apiName DeleteOroscopo
 * @apiGroup Oroscopi
 * @apiParam {Number} id post ID
 * @apiSuccess {json} returns the deleted post
 * @apiSuccessExample {json} Success-Response:
 * 
 * HTTP/1.1 200 OK
 * 
 * {
 *   _id: new ObjectId("62d18b07ad65ca40e349ffe0"),
 *   title: 'title_example',
 *   body: '<p>body_example</p>,
 *   segno: 'cancer',
 *   user: new ObjectId("62c2b71221c49f5f1c0335f0"),
 *   createdAt: 2022-07-15T15:43:03.852Z,
 *   __v: 0
 * }
 * 
 * @apiError OroscopeNotFound The Id of the oroscope is not found.
 *
 * @apiErrorExample Error-Response:
 * 
 * HTTP/1.1 404 Not Found
 * 
 * {
 *   "error": "OroscopeNotFound"
 * }
 */

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
