const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')
const upload = require('../uploads/upload.js')

router.get("/:id/edit", userController.user_edit_get)
router.post('/:id', upload.single('picture'), userController.user_update_post)
router.get('/:id', userController.getUserById)







module.exports = router