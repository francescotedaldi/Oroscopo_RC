const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')  //prende i dati utente


// l'input passport provine da passport config in app.js
module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },

            // funzione async poichè stiamo lavorando con mongoose
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile)
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
