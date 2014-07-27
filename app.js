// Express and third-party middleware
var express = require('express'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	busboy = require('connect-busboy'),
	// Custom middleware
	routes = require('./routes'),
	// Misc libraries & variables
	path = require('path'),
	// App to configure
	app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
require('./errorHandler')(app);

module.exports = app;
