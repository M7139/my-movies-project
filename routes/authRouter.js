const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const upload = require('../uploads/upload.js')

// User Authentication Routes
router.post('/sign-up', upload.single('picture'), authController.registerUser)




// Render Authentication Views
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs') 
})





module.exports = router