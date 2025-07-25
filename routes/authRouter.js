const express = require('express')
const upload = require('../uploads/upload.js')

const router = express.Router()
const authController = require('../controllers/authController.js')
const { isLoggedIn } = require('../middlewares/auth.js')

router.get('/sign-up', authController.auth_sign_up_get)
router.post('/sign-up', upload.single('picture'), authController.auth_sign_up_post)

router.get('/sign-in', authController.auth_sign_in_get)
router.post('/sign-in', authController.auth_sign_in_post)

router.get('/sign-out', isLoggedIn, authController.auth_sign_out_post)
router.put('/:id', authController.auth_update_password_put)

module.exports = router

