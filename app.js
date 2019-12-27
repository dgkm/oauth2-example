var express = require('express');
var routes = require('./routes');
var config = require('./config');
var path = require('path');
var models = require('./models');
var middleware = require('./middleware');
var app = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var oauthserver = require('node-oauth2-server');
var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var errorHandler = require('errorhandler')
var cors = require('cors')

var User = models.User;

app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser('ncie0fnft6wjfmgtjz8i'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(cors())

app.locals.title = 'OAuth Example';
app.locals.pretty = true;

//app.use('development', 'production', function() {
  //app.use(express.logger('dev'));
//});
app.use(morgan('combined'))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());

app.oauth = oauthserver({
  model: models.oauth,
  grants: ['password', 'authorization_code', 'refresh_token'],
  debug: true
});

//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV !== 'test')
    console.error('Error:', err);

  if (middleware.isValidationError(err)) {
    res.status(400);
    res.send(err.errors);
  } else {
    res.status(err.code || 500);
    res.send('(' + (err.code || 500) + ") " + err);
  }
});

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.get('/', middleware.loadUser, routes.index);

app.all('/oauth/token', app.oauth.grant());

app.get('/oauth/authorise', function(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/session?redirect=' + req.path + '&client_id=' +
      req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
  }

  res.render('authorise', {
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri
  });
});

// Handle authorise
app.post('/oauth/authorise', function(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/session?redirect=' + req.path + 'client_id=' +
      req.query.client_id +'&redirect_uri=' + req.query.redirect_uri);
  }

  next();
}, app.oauth.authCodeGrant(function(req, next) {
  // The first param should to indicate an error
  // The second param should a bool to indicate if the user did authorise the app
  // The third param should for the user/uid (only used for passing to saveAuthCode)
  next(null, req.body.allow === 'yes', req.session.userId, null);
}));

app.get('/secret', middleware.requiresUser, function(req, res) {
  res.send('Secret area');
});

app.use(app.oauth.errorHandler());

app.post('/v1/users', routes.users.create);
app.get('/account', middleware.requiresUser, routes.users.show);
app.post('/session', routes.session.create);
app.get('/session', routes.session.show);

module.exports = app;
