const path = require('path')
const express = require('express')
const request = require('request');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const passport = require('passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')               //per usare passport
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')              //per salvare la sessione su mongoDB


var apiUtils = require('./public/apiUtils.js');

// Load config
dotenv.config({ path: './config/dati_sensibili.env' })


// Passport config
require('./config/passport')(passport)

connectDB()
const app = express()

// Body parser per accettare i dati della form, così possiamo accettare i dati da req.body in routes/oroscopi.js
app.use(express.urlencoded({ extended: false }))
// accettiamo anche dati json
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


// Handlebars Helpers
const {
  formatDate,
  saveIcon,
  select,
} = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({
  helpers: {
    formatDate,
    saveIcon,
    select,
  }, defaultLayout: 'main', extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Sessions, middleware per passport, per info cerca express session su internet
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,    // non salviamo la sessione se nulla è stato modificato
    saveUninitialized: false, // non creare una sessione almeno che qualcosa non viene archiviato

    // salva la sessione
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Linkiamo i file Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/oroscopi', require('./routes/oroscopi'))

app.use('/', express.static('./public'))

/////////

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`!!! Server is running in ${process.env.NODE_ENV} mode on port ${PORT} !!!`)
)
