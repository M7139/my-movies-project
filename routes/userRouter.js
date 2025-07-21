const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')
const upload = require('../uploads/upload.js')

router.get("/:id/edit", userController.user_edit_get)
router.post('/:id', upload.single('picture'), userController.user_update_post)
router.get('/:id', userController.user_profile_get)

router.get('/:id/watching', userController.watching_list_get)
router.get('/:id/watched', userController.watched_list_get)
router.get('/:id/will-watch', userController.willWatch_list_get)
router.post('/:id/remove/:movieId', userController.remove_from_list)




module.exports = router