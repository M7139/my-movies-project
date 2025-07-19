const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const upload = require('../uploads/upload.js')

// User Authentication Routes
router.post('/sign-up', upload.single('picture'), authController.auth_sign_up_post)
router.post('/sign-in', authController.auth_sign_in_post)
router.post('/sign-out', authController.auth_sign_out_post)
router.put('/:id', authController.auth_update_poassword_put)




// Render Authentication Views
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs') 
})

router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})

router.get('/sign-out', authController.auth_sign_out_post) 

router.get('/:id/update-password', (req, res) => {
  res.render('./auth/update-password.ejs')
})


module.exports = router