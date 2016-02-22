/**
 * This file contains the Express app logic and exports it in an app variable
 */

/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var device = require('express-device');

/**
 * Other dependencies.
 */
var config = require('./config');
var schema = require('./orm/schema');

var db          = require('mysql'); //This sets up the MySQL connection

var db_pool     = db.createPool({
    host        : config.db.host,
    port        : config.db.port,
    database    : config.db.database,
    user        : config.db.user,
    password    : config.db.password
});

/**
 * Require routes
 */
var routes = require('./routes/index'); 
//var users = require('./routes/users');

/**
 * Initalize express
 */
var app = express();

/**
 * View engine setup
 * http://twitter.github.io/hogan.js/
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

/**
 * ORM setup
 * http://twitter.github.io/hogan.js/
 */
app.set('config', config);
app.set('schema', schema);
app.set('db', db);
app.set('db_pool', db_pool);

/**
 * Favicon setup
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * Logger setup
 */
app.use(logger('dev'));

/**
 * Body and Cookies parser setup
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Add device recognition
 * https://www.npmjs.com/package/express-device
 */
app.use(device.capture());

/**
 * Session setup
 * TODO: For production: https://www.npmjs.com/package/connect-mongo
 */
app.set('trust proxy', 1); // trust first proxy
app.use( session({
   secret : 'fsdgsdgsd523sfe44fa44',
   name : 'sid',
   resave: true,
   saveUninitialized: true/*,
   cookie: { secure: true }*/
  })
);


/**
 * Static setup
 * http://expressjs.com/en/4x/api.html#express.static
 */
var staticOptons = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}
app.use(express.static(path.join(__dirname, 'public'), staticOptons)); // multiple can be defined

/**
 * Load routes
 */
app.use('/', routes);
//app.use('/users', users);

/**
 * Catch 404 and forward to error handler
 * If no routes match...
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handlers
 */

/**
 * Development error handler / will print stacktrace
 */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
    });
}

/**
 * Production error handler / no stacktraces leaked to user
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: {}
    });
});

/**
 * exporting the initalized app
 */
module.exports = app;