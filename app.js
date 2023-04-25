// Express and third-party middleware
var express = require('express'),
	bodyParser = require('body-parser'),
	// Custom middleware
	routes = require('./routes'),
	// Misc libraries & variables
	path = require('path'),
	// App to configure
	app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('static-favicon')());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('connect-busboy')());
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
require('./errorHandler')(app);

module.exports = app;
