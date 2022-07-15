const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')  //prende i dati utente
const auth = require('../routes/auth')
const mailer = require("../middleware/mailSender") //invia email di benvenuto
const amqp = require('amqplib/callback_api') //AMQP per RabbitMQ
const sender = require("../middleware/sender")
const receiver = require("../middleware/receiver")

// l'input passport provine da passport config in app.js
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:443/auth/google/callback",
        passReqToCallback: true,
      },

      async (req, accessToken, refreshToken, profile, done) => {
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        }

        // per salvare l'utente
        try {
          let user = await User.findOne({ googleId: profile.id })

          //Se l'user è già presente
          if (user) {
            sender.send();
            receiver.recv();
            done(null, user);
          } 
          else {
            user = await User.create(newUser)
            mailer.sendWelcomeMail(profile.emails[0].value)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  // controlla documentazione passport per capire bene cos'è un serializeUser
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
