const Movie = require('../models/Movie.js')
const User = require('../models/User.js')
require('dotenv').config()

const movieSearch_get = async (req, res) => {
  // get movie name from query
  const searchTerm = req.query.movie_name

  // get api key from enviroment variables
  const apiKey = process.env.OMDB_API_KEY

  // empty array for movies
  let movies = []

  try {
    // fetch movie data from omdb api
    const response = await fetch(
      `http://www.omdbapi.com/?s=${encodeURIComponent(
        searchTerm
      )}&apikey=${apiKey}`
    )

    // get response as json
    const data = await response.json()

    // check 'response' field in the api result
    if (data.Response === 'True') {
      movies = data.Search // if request is successful movies = response data
    }
  } catch (err) {
    console.error('Fetch error from OMDb:', err.message)
  }

  res.render('./movies/movie-list.ejs', { movies, searchTerm })
}



const movieDetail_get = async (req, res) => {
  const imdbID = req.params.imdbID
  const apiKey = process.env.OMDB_API_KEY
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
    )
    const movie = await response.json()
    if (movie.Response === 'True') {
      res.render('./movies/show.ejs', { movie, user: req.session.user })
    } else {
      res.status(404).send('Movie not found.')
    }
  } catch (err) {
    console.error('Error fetching movie details:', err.message)
    res.status(500).send('Server error.')
  }
}

const addToList = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    const imdbID = req.params.imdbID
    const listType = req.body.listType
    
    // First, check if movie exists in our database
    let movie = await Movie.findOne({ imdbID })
    
    if (!movie) {
      // If not, fetch from OMDB and save to our database
      const apiKey = process.env.OMDB_API_KEY
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
      )
      const omdbData = await response.json()
      
      movie = new Movie({
        title: omdbData.Title,
        picture: omdbData.Poster,
        type: omdbData.Type === 'series' ? 'series' : 'movie',
        description: omdbData.Plot,
        imdbID: omdbData.imdbID
      })
      await movie.save()
    }
    
    // Remove from other lists
    user.willWatch = user.willWatch.filter(id => !id.equals(movie._id))
    user.watching = user.watching.filter(id => !id.equals(movie._id))
    user.watched = user.watched.filter(id => !id.equals(movie._id))
    
    // Add to selected list
    if (listType === 'willWatch') {
      user.willWatch.push(movie._id)
    } else if (listType === 'watching') {
      user.watching.push(movie._id)
    } else if (listType === 'watched') {
      user.watched.push(movie._id)
    }
    
    await user.save()
    res.redirect(`/movies/${imdbID}`)
  } catch (err) {
    console.error('Error adding to list:', err.message)
    res.status(500).send('Server error.')
  }
}

module.exports = {
  movieSearch_get,
  movieDetail_get,
  addToList
}