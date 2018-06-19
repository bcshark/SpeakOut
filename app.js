var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

var web = express.static(path.join(__dirname, 'src'));
var contracts = express.static(path.join(__dirname, 'build/contracts'));
var baiduapi = require('./services/baiduapi');

// var favicon = require('serve-favicon');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'SpeakOut', resave: true, saveUninitialized: false }));

// add routes
app.use('/contracts', contracts);
app.use('/baiduapi', baiduapi);
app.use('/', web);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

console.log('run application as environment: ' + app.get('env'));
if (app.get('env') === 'development') {
    // development error handler, will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler, no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;