
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`!!! MongoDB Connesso: ${conn.connection.host} !!!`)
  } catch (err) {
    console.error("\n\n!!! ERRORE NELL' ACCESSO AL DB !!!\n\n")
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB