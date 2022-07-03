const express = require('express')
const app = express()

app.use(express.json())

//  Create and use routes
const paymentRoutes = require('./routes/payments')

var cors = require('cors')

app.use('/split-payments', paymentRoutes,  cors())

app.options('*', cors())


app.listen(3000, () => console.log('Server has started'))
