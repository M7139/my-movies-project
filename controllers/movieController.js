const Movie = require('../models/Movie')
const User = require('../models/User')

// Home page - Display all movies and allow adding to lists
const movie_index = async (req, res) => {
  try {
    const movies = await Movie.find()
    res.send("Home Page")
    // res.render('movies/index', { movies, user: req.session.user })
  } catch (error) {
    console.error('Error fetching movies:', error)
    res.status(500).send('Error fetching movies')
  }
}