const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController.js')

// Home page - Display all movies and form to add new ones
router.get('/', movieController.movieSearch_get)

router.get('/movie-list', (req, res) => {
  res.render('./movies/movie-list.ejs', { movies: [], searchTerm: '' })
})

router.get('/:imdbID', movieController.movieDetail_get)

module.exports = router
