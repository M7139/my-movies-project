const bcrypt = require('bcrypt')
const User = require('../models/User.js')

// Show sign-up form
const auth_sign_up_get = (req, res) => {
  res.render('auth/sign-up.ejs')
}

// Handle sign-up form submission
const auth_sign_up_post = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.status(400).render('error.ejs', { message: 'Username already taken!' })
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).render('error.ejs', { message: 'Password and Confirm Password must match' })
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 12)

    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.file ? req.file.path : "Default/default_pfp.jpg"
    })

    res.render('auth/thanks.ejs')
  } catch (error) {
    console.error('Error registering user:', error.message)
    res.status(500).render('error.ejs', { message: 'Server error during sign-up.' })
  }
}

// Show sign-in form
const auth_sign_in_get = (req, res) => {
  res.render('auth/sign-in.ejs')
}

// Handle sign-in form submission
const auth_sign_in_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).render('error.ejs', { message: 'No user registered with that email. Please sign up!' })
    }

    const validPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).render('error.ejs', { message: 'Incorrect password! Please try again.' })
    }

    req.session.user = {
      email: user.email,
      first: user.first,
      last: user.last,
      picture: user.picture,
      _id: user._id
    }

    res.redirect(`/users/${user._id}/edit`)
  } catch (error) {
    console.error('Error signing in user:', error.message)
    res.status(500).render('error.ejs', { message: 'Server error during sign-in.' })
  }
}

// Handle sign-out
const auth_sign_out_post = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/')
    })
  } catch (error) {
    console.error('Error signing out user:', error.message)
    res.status(500).render('error.ejs', { message: 'Server error during sign-out.' })
  }
}

// Update password
const auth_update_password_put = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).render('error.ejs', { message: 'No user with that ID exists!' })
    }

    const validPassword = bcrypt.compareSync(req.body.oldPassword, user.password)
    if (!validPassword) {
      return res.status(400).render('error.ejs', { message: 'Your old password was not correct! Please try again.' })
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).render('error.ejs', { message: 'Password and Confirm Password must match' })
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 12)
    await user.save()

    // Sign out user after password change
    auth_sign_out_post(req, res)
  } catch (error) {
    console.error("Error updating user's password:", error.message)
    res.status(500).render('error.ejs', { message: 'Server error during password update.' })
  }
}

module.exports = {
  auth_sign_up_get,
  auth_sign_up_post,
  auth_sign_in_get,
  auth_sign_in_post,
  auth_sign_out_post,
  auth_update_password_put
}
