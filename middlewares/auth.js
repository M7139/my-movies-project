const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).render('error.ejs', { message: 'Unauthorized: Please log in.' });
  }
  next();
}

const isAuthorizedUser = (req, res, next) => {
  if (req.session.user._id !== req.params.id) {
    return res.status(403).render('error.ejs', { message: 'Unauthorized: You cannot access another user\'s data.' });
  }
  next();
}

module.exports = {
  isLoggedIn,
  isAuthorizedUser
};
