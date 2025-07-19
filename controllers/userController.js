const User = require('../models/User.js')
const Movie = require('../models/Movie.js')


const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const movies = await Movie.find({author : user._id})
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      watched: user.watched,
      watching: user.watching,
      willWatch: user.willWatch
    }

    res.render("./users/profile.ejs",{user})
  } catch (error){
    console.error("An error has occurred finding a user!", error.message)
  }
}

module.exports = {
  getUserById
}