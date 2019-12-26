var User = require('./../models').User;

module.exports.create = function(req, res, next) {
  User.authenticate(req.body.email, req.body.password, function(err, user) {
    if (err) return next(err);

    if (user) {
      req.session.userId = user.email;
      var redirect = (req.query.redirect != null ? req.query.redirect : '/account');

      if(redirect === "/oauth/authorise") {
        res.redirect(redirect + '?client_id=' + req.query.client_id +'&redirect_uri=' + req.query.redirect_uri);
      } else {
        res.redirect(redirect);
      }
    } else {
      res.status(401).render('login');
    }
  });
};

module.exports.show = function(req, res, next) {
  res.render('login');
};
