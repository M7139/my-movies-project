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

const user_edit_get = async (req,res) =>{
  const currentUser = await User.findById(req.params.id)
  res.render("users/edit.ejs", {user : currentUser})
} 

const user_update_post = async (req, res) => {
  const updateData = {
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
  }

  if (req.file) {
    updateData.picture = req.file.path
  } else {
    updateData.picture = req.body.picture
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
  res.redirect(`/users/${updatedUser._id}`)
}


module.exports = {
  getUserById,
  user_edit_get,
  user_update_post
}