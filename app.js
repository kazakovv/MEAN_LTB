var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session  = require('express-session');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
//connect to mongodb
mongoose.connect("mongodb://localhost:27017/baby-diary");
//load the models for the mongoose database
require('./models/models.js');

var api = require('./routes/api');
var api_babies = require('./routes/api_babies');
var api_growthRecords = require('./routes/api_growthrecords');
var api_feverRecords = require('./routes/api_feverrecords');
var api_developmentRecords = require('./routes/api_developmentrecords');
var api_users = require('./routes/api_users');
var auth = require('./routes/auth')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//express session used for passport hash strings
app.use(session({
  secret: 'super secret string for making password hashes'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);


app.use('/api', api);
app.use('/api/Babies', api_babies);
app.use('/api/GrowthRecords', api_growthRecords);
app.use('/api/FeverRecords', api_feverRecords);
app.use('/api/DevelopmentRecords', api_developmentRecords);
app.use('/api/Users', api_users);
app.use('/auth', auth);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});







// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
