const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController')
const upload = require('../uploads/upload')

// Home page - Display all movies and form to add new ones
router.get('/', movieController.movie_index)
router.post('/', upload.single('picture'), movieController.movie_create_post)