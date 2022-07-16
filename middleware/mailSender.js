const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const usr = require("../models/User")

dotenv.config();

module.exports = {
  sendWelcomeMail: (email) => {
    /* send registration email */
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    });

    const mailOptions = {
      from: process.env.SERVER_MAIL,
      to: email,
      subject: "Mail di Benvenuto",
      html: `<h1>Grazie per aver scelto i nostri servizi!</h1>`,
      auth: {
        type: "Bearer",
        user: process.env.SERVER_MAIL,
        pass: process.env.SERVER_SECRET,
      },
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
          console.error(err.message)
          // put the failed message item back to queue
      }
      else
        console.log('Delivered message');
    });
  },
};