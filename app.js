const path = require('path')
const express = require('express')
const request = require('request');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const passport = require('passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')


dotenv.config({ path: './config/dati_sensibili.env' })

require('./config/passport')(passport)

connectDB()
const app = express()

// Body parser per accettare i dati della form, così possiamo accettare i dati da req.body in routes/oroscopi.js
app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

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

// Sessions, middleware per passport
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,

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

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`!!! Server is running in ${process.env.NODE_ENV} mode on port ${PORT} !!!`)
)
