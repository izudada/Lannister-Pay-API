const express = require('express')
const app = express()

app.use(express.json())

//  Create and use routes
const paymentRoutes = require('./routes/payments')
app.use('/split-payments', paymentRoutes)


//  For development server or localhost
// app.listen(3000, () => console.log('Server has started'))

//  For production or deployment server
app.listen()