const Movie = require('../models/Movie.js')
const User = require('../models/User.js')

// Home page - Display all movies and allow adding to lists
const movie_index = async (req, res) => {
    const movies = await Movie.find()
    res.send("Home Page")
    // res.render('movies/index', { movies, user: req.session.user })
}

// Add a new movie to a list
const movie_create_post = async (req, res) => {
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
  
}

// Display movies in a page list
const movie_list = async (req, res) => {
    const listType = req.params.listType // 'watched', 'watching', or 'willWatch'
    const userId = req.session.user._id
    const user = await User.findById(userId).populate(listType)
    const movies = user[listType]
    res.render(`movies/${listType}`, { movies, listType, user: req.session.user })

}

module.exports = {
movie_index,
movie_create_post,
movie_list
}