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
	fs = require('fs'),
	path = require('path'),
	uploadPath = path.join(__dirname, 'uploads'),
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
// TODO: clean this up - bad impl
if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

require('./errorHandler')(app);

module.exports = app;
