const express = require('express');
const mustache = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const users = require('./users.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

// start session
app.use(session({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true
}))

function auth(userCheck, passCheck) {
  console.log('attempting auth');
  var authenticatedUser = users.user.find(function (user) {
    if (userCheck === user.username && passCheck === user.password) {
      console.log('User & Password Authenticated');
      return user;
    }
  });
  if (authenticatedUser) {
    return true;
  }
  return false;
}

app.use('/', function(req, res, next) {
  // check if the user is logged in, if not, redirect to /login
  // if logged in, then allow to proceed
  var loggedIn = req.session.loggedIn;
  var userInfo = req.session.userInfo;
  var clicker = req.session.clicker;

  if (!loggedIn) {
    loggedIn = req.session.loggedIn = false;
    userInfo = req.session.userInfo = {};
    clicker = req.session.clicker = {};
  }

  next();
});

app.get('/', function(req, res) {
  if (!req.session.loggedIn) {
    res.redirect('login');
  } else {
    res.render('index.mustache', req.session.userInfo);
  }
})

app.get('/login', function (req, res) {
  res.render('login.mustache', {});
})

app.post('/login', function (req, res) {
  console.log('checking auth');
  console.log(req.body.username, req.body.pass);
  req.session.loggedIn = auth(req.body.username, req.body.pass);
  console.log('auth', req.session.loggedIn);
  if (req.session.loggedIn) {
    req.session.userInfo['username'] = req.body.username;
    req.session.userInfo['clicker'] = 0;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.post('/logout', function (req,res) {
  console.log('logging out');
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    }
    console.log('destroying session');
    res.redirect('/login');
  });
});

app.post('/plusone', function (req, res) {
  console.log('increment button counter');
  req.session.userInfo.clicker++
  res.redirect('/');
})

app.listen(3000, function() {
  console.log('listening to http://localhost:3000/');
});
