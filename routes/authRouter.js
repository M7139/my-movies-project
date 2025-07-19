const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const upload = require('../uploads/upload.js')

// User Authentication Routes
router.post('/sign-up', upload.single('picture'), authController.registerUser)