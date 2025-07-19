const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const upload = require('../uploads/upload.js')

// User Authentication Routes
router.post('/sign-up', upload.single('picture'), authController.registerUser)
router.post('/sign-in', authController.signInUser)
router.post('/sign-out', authController.signOutUser)




// Render Authentication Views
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs') 
})


router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})

router.get('/sign-out', authController.signOutUser) 



module.exports = router