const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')

// Load config
dotenv.config({ path: './config/dati_sensibili.env' })

connectDB()

const app = express()

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars       exphbs.engine() oppure exphbs()?
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// Linkiamo i file Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`!!! Server is running in ${process.env.NODE_ENV} mode on port ${PORT} !!!`)
)