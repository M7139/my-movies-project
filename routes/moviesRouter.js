const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController.js')
const upload = require('../uploads/upload.js')

// Home page - Display all movies and form to add new ones
router.get('/', movieController.movie_index)

router.post('/', upload.single('picture'), movieController.movie_create_post)
// page list pages
router.get('/:listType', movieController.movie_list)



module.exports = router