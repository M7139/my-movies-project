const bcrypt = require('bcrypt')
const User = require('../models/User.js')

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.send('Username already taken!')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 12)

    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.file ? req.file.path : null
    })

    res.render('./auth/thanks.ejs')
  } catch (error) {
    console.error('An error has occurred registering a user!', error.message)
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send('No user has been registered with that email. Please sign up!')
    }

    const validPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!validPassword) {
      return res.send('Incorrect password! Please try again.')
    }

    req.session.user = {
      email: user.email,
      _id: user._id
    }

    res.redirect(`/users/${user._id}`)
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.error('An error has occurred signing out a user!', error.message)
  }
}

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send('No user with that ID exists!')
    }

    const validPassword = bcrypt.compareSync(req.body.oldPassword, user.password)
    if (!validPassword) {
      return res.send('Your old password was not correct! Please try again.')
    }
    
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    await user.save()
    res.render('./auth/confirm.ejs', { user })
  } catch (error) {
    console.error("An error has occurred updating a user's password!", error.message)
  }
}



module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}