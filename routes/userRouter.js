const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')
const upload = require('../uploads/upload.js')
const { isLoggedIn, isAuthorizedUser } = require('../middlewares/auth.js')

// Profile view and edit
router.get('/:id/edit', isLoggedIn, isAuthorizedUser, userController.user_edit_get)
router.post('/:id', isLoggedIn, isAuthorizedUser, upload.single('picture'), userController.user_update_post)
router.get('/:id', isLoggedIn, userController.user_profile_get)

// List views
router.get('/:id/watching', isLoggedIn, isAuthorizedUser, userController.watching_list_get)
router.get('/:id/watched', isLoggedIn, isAuthorizedUser, userController.watched_list_get)
router.get('/:id/will-watch', isLoggedIn, isAuthorizedUser, userController.willWatch_list_get)

// Remove movie from list
router.post('/:id/remove/:movieId', isLoggedIn, isAuthorizedUser, userController.remove_from_list)

module.exports = router
