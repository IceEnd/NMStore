var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var mysql = require('mysql');
var fs = require('fs');
var crypto = require('crypto');

var routes = require('./routes/index');
var users = require('./routes/users');
var storema = require('./routes/storema');
var goods = require('./routes/goods');
var shopping = require('./routes/shopping');
var car = require('./routes/car');
var ws = require('./routes/ws');

var app = express();

var expressWs = require('express-ws')(app);
var accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(connect.session({
  secret: '123456',
  key: '123456',
  cookie: { maxAge: 8000000 }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/storema', storema);
app.use('/goods', goods);
app.use('/shopping', shopping);
app.use('/car', car);
app.use('/ws',car);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
app.listen(8000);
