var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var cors = require('cors');

var parseurl = require('parseurl');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());
// ***token */
app.use('/api', expressJwt({
  secret: "secret"
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//CORS
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DETELE");
//   next();
// });

//Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  if (!req.session.userName) {
    req.session.userName = '';
  }
  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})

app.get('/foo/:userName', function (req, res, next) {
  res.send(req.session.userName + ' you viewed this page ' + req.session.views['/foo/fred'] + ' times')
})

app.get('/bar', function (req, res, next) {
  res.send(req.session.userName + ' you viewed this page ' + req.session.views['/bar'] + ' times')
})





app.get('/api/restricted/:userName', function (req, res, next) {
  console.log('user ' + req.params.userName + ' is calling /api/restricted');
  res.send({
    name: 'foo'
  });
});

app.post('/authenticate', function (req, res, next) {
  console.log(req.body.username);
  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
    res.status(401).send('Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };
  var token = jwt.sign(profile, "secret", {
    expiresIn: 60 * 5
  });
  
  res.send({
    token: token
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.listen(3000, null);

module.exports = app;