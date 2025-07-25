const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController.js')
const { isLoggedIn } = require('../middlewares/auth.js')

router.get('/sign-up', authController.auth_sign_up_get)
router.post('/sign-up', authController.auth_sign_up_post)

router.get('/sign-in', authController.auth_sign_in_get)
router.post('/sign-in', authController.auth_sign_in_post)

router.get('/sign-out', isLoggedIn, authController.auth_sign_out_post)

module.exports = router
