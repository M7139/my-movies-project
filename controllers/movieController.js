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


// DEEP SEEK WAS USED TO IMPLEMENT THE WIKIPEDIA API SECION AND FOR STYLING TOO
const movieDetail_get = async (req, res) => {
  const imdbID = req.params.imdbID
  const apiKey = process.env.OMDB_API_KEY
  
  try {
    // Fetch movie details from OMDB
    const response = await fetch(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
    )
    const movie = await response.json()
    
    if (movie.Response === 'True') {
      // Process actors to get their images from Wikipedia
      const actors = movie.Actors ? movie.Actors.split(', ') : []
      
      // Create an array of promises to fetch actor images
      const actorImagePromises = actors.map(async (actorName) => {
        try {
          // First, search Wikipedia for the actor's page
          const searchResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(actorName)}&origin=*`
          )
          const searchData = await searchResponse.json()
          
          if (searchData.query.search.length > 0) {
            const pageTitle = searchData.query.search[0].title
            
            // Get page images
            const imageResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(pageTitle)}&pithumbsize=200&origin=*`
            )
            const imageData = await imageResponse.json()
            
            const pages = imageData.query.pages
            const pageId = Object.keys(pages)[0]
            
            return {
              name: actorName,
              image: pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null
            }
          }
        } catch (err) {
          console.error(`Error fetching image for ${actorName}:`, err.message)
          return {
            name: actorName,
            image: null
          }
        }
        
        return {
          name: actorName,
          image: null
        }
      })
      
      // Wait for all actor image fetches to complete
      const actorsWithImages = await Promise.all(actorImagePromises)
      
      // Render the view with movie data and actors with images
      res.render('./movies/show.ejs', { 
        movie, 
        actors: actorsWithImages,
        user: req.session.user 
      })
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