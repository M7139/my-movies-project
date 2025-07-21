const User = require('../models/User.js')
const Movie = require('../models/Movie.js')

const user_profile_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('watched')
      .populate('watching')
      .populate('willWatch');

    res.render("./users/profile.ejs", { 
      user,
      watchedMovies: user.watched,
      watchingMovies: user.watching,
      willWatchMovies: user.willWatch
    });
  } catch (error) {
    console.error("An error has occurred finding a user!", error.message);
    res.status(500).send("Server error");
  }
};

const watching_list_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('watching');
    res.render("./users/watching.ejs", {
      user,
      movies: user.watching
    });
  } catch (error) {
    console.error("Error fetching watching list:", error.message);
    res.status(500).send("Server error");
  }
};

const watched_list_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('watched');
    res.render("./users/watched.ejs", {
      user,
      movies: user.watched
    });
  } catch (error) {
    console.error("Error fetching watched list:", error.message);
    res.status(500).send("Server error");
  }
};

const willWatch_list_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('willWatch');
    res.render("./users/will-watch.ejs", {
      user,
      movies: user.willWatch
    });
  } catch (error) {
    console.error("Error fetching will-watch list:", error.message);
    res.status(500).send("Server error");
  }
};

const remove_from_list = async (req, res) => {
  try {
    const { id, movieId } = req.params;
    const { listType } = req.body;
    
    const user = await User.findById(id);
    
    if (listType === 'watched') {
      user.watched = user.watched.filter(movie => !movie.equals(movieId));
    } else if (listType === 'watching') {
      user.watching = user.watching.filter(movie => !movie.equals(movieId));
    } else if (listType === 'willWatch') {
      user.willWatch = user.willWatch.filter(movie => !movie.equals(movieId));
    }
    
    await user.save();
    res.redirect(`/users/${id}/${listType}`);
  } catch (error) {
    console.error("Error removing from list:", error.message);
    res.status(500).send("Server error");
  }
};

const user_edit_get = async (req,res) => {
  const currentUser = await User.findById(req.params.id);
  res.render("users/edit.ejs", { user: currentUser });
};

const user_update_post = async (req, res) => {
  const updateData = {
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
  };

  if (req.file) {
    updateData.picture = req.file.path;
  } else {
    updateData.picture = req.body.picture;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.redirect(`/users/${updatedUser._id}`);
};

module.exports = {
  user_profile_get,
  user_edit_get,
  user_update_post,
  watching_list_get,
  watched_list_get,
  willWatch_list_get,
  remove_from_list
};