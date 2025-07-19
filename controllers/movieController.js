const Movie = require('../models/Movie.js')
const User = require('../models/User.js')

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

// Add a new movie to a list
const movie_create_post = async (req, res) => {
  try {
    const { title, type, description } = req.body
    const listType = req.body.listType // 'watched', 'watching', or 'willWatch'
    const userId = req.session.user._id

    // Create new movie
    const movie = await Movie.create({
      title,
      type,
      description,
      picture: req.file ? req.file.path : null
    })

    // Add to user's list
    await User.findByIdAndUpdate(userId, {
      $push: { [listType]: movie._id }
    })

    res.redirect('/movies')
  } catch (error) {
    console.error('Error adding movie:', error)
    res.status(500).send('Error adding movie')
  }
}

module.exports = {
movie_index,
movie_create_post
}