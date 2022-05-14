
const mongoose = require('mongoose')

// con mongoose lavoriamo con le promesse, doviamo lavorare per forza asincroni

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false,
    })

    console.log(`!!! MongoDB Connesso: ${conn.connection.host} !!!`)
  } catch (err) {   // in caso di errore ferma tutto
    console.error(err)
    process.exit(1)
  }
}

// così possiamo runnanrlo nel file app.js
module.exports = connectDB