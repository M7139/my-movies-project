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
      res.render('./movies/show.ejs', { movie })
    } else {
      res.status(404).send('Movie not found.')
    }
  } catch (err) {
    console.error('Error fetching movie details:', err.message)
    res.status(500).send('Server error.')
  }
}

module.exports = {
  movieSearch_get,
  movieDetail_get
}
