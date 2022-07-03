require('dotenv').config()  // Use env values

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//  Connect to db
mongoose.connect(process.env.DATABASE_URL,  { useNewUrlParser: true })
const db = mongoose.connection

//  Checking db conection status
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

//  Create and use routes
const paymentRoutes = require('./routes/payments')
app.use('/payments', paymentRoutes)

app.listen(3000, () => console.log('Server has started'))