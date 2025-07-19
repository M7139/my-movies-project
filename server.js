const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('./db')
const authRouter = require('./routes/authRouter.js')
const userRouter = require('./routes/userRouter.js')
const movieRouter = require('./routes/moviesRouter.js')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const app = express()

// Middleware
app.use(logger('dev'))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/uploads', express.static('uploads')) 

// Set up local variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

// Routes
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/movies', movieRouter)

app.get('/', (req, res) => {
  res.render('index.ejs', { user: req.session.user })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT} `)
})