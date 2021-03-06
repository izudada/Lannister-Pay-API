const express = require('express')
const app = express()

app.use(express.json())

//  Create and use routes
const paymentRoutes = require('./routes/payments')

app.use('/split-payments', paymentRoutes)


app.listen(process.env.PORT || 5000, () => console.log('Server has started'))
