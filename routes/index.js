var _ = require('lodash'),
	router = require('express').Router(),
	fs = require('fs'),
	path = require('path'),
	uploadPath = path.join(process.cwd(), 'uploads'),
	initialsSanitizer = require('../initialSanitizer'),
	rowCollapser = require('../rowCollapser'),
	excelHelper = require('../excelHelper');

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

function generateFileDir(token) {
	return path.join(uploadPath, token);
}

function generateFilePath(token, file) {
	return path.join(generateFileDir(token), file);
}

function renderError(res, msg) {
	res.status(500);
	res.render('error', { 'message': msg, 'error': {} });
}

// TODO: Move this to initial-sanitizer?
function cleanInitials (columns, sheet) {
	_.each(columns, function (c) {
		_.each(sheet, function (row) {
			row[c] = initialsSanitizer(row[c]);
		});
	});
}

/* GET home page. */
router.get('/', function(req, res) {
	var missingSheetName = req.query.missingSheetName || 'false',
		missingFile = req.query.missingFile || 'false';

	res.render('index', {
	  'title': 'Excel Processor',
	  'missingSheetName': missingSheetName.toLowerCase() === 'true',
	  'missingFile': missingFile.toLowerCase() === 'true'
	});
});

/* POST file */
router.post('/upload', function (req, res) {
	var gotFile = false,
		configureParams = { 'title': 'Configure Columns', 'token': new Date().getTime().toString() };
	req.busboy.on('file', function (fieldname, file, filename) {
		var fstream,
			filepath = generateFilePath(configureParams.token, filename);
		gotFile = true;
		configureParams.file = filename;

		fs.mkdirSync(generateFileDir(configureParams.token));
		fstream = fs.createWriteStream(filepath);
		file.pipe(fstream);
		fstream.on('close', function () {
			configureParams.headers = excelHelper.readSheet(filepath, configureParams.sheetName).headers;
			res.render('configure', configureParams);
		});
	});
	req.busboy.on('field', function (key, value) {
		if (key === 'sheetName') {
			configureParams.sheetName = value;
		}
	});
	req.busboy.on('finish', function () {
		if (!configureParams.sheetName || !gotFile) {
			res.redirect('/?missingSheetName=' + !configureParams.sheetName + '&missingFile=' + !gotFile);
		}
	});
	req.pipe(req.busboy);
});

/* POST processing info */
router.post('/process', function (req, res) {
	if (!req.body.token) {
		renderError(res, 'No token provided');
	}
	else if (!req.body.file) {
		renderError(res, 'No file provided');
	}
	else if (!req.body.sheetName) {
		renderError(res, 'No sheetName provided');
	}
	else {
		var collapsedSheet,
			cleanColumns = [],
			keyColumns = [],
			intColumns = [],
			sheet = excelHelper.readSheet(generateFilePath(req.body.token, req.body.file), req.body.sheetName),
			fstream = fs.createWriteStream(generateFilePath(req.body.token, 'processed.csv'));
		_.keys(req.body).forEach(function (prop) {
			if (req.body[prop] === 'key') {
				keyColumns.push(prop);
			}
			else if (req.body[prop] === 'sum') {
				intColumns.push(prop);
			}
			else if (req.body[prop] === 'clean') {
				cleanColumns.push(prop);
			}
		});
		cleanInitials(cleanColumns, sheet.data);
		collapsedSheet = rowCollapser(sheet.data, keyColumns, intColumns);
		excelHelper.writeCsv(fstream, sheet.headers, collapsedSheet);
		res.render('results', { 'token': req.body.token, 'sheetName': req.body.sheetName });
	}
});

/* GET processed file */
router.get('/download/:token', function (req, res) {
	if (!req.params.token) {
		renderError(res, 'No token provided');
	}
	else if (!req.query.name) {
		renderError(res, 'No sheetName provided');
	}
	else {
		var file = path.join(uploadPath, req.params.token, 'processed.csv');
		if (!fs.existsSync(file)) {
			console.log('Unable to find: ' + file);
			renderError(res, 'Internal error');
		}
		else {
			res.download(file, req.query.name + '.csv');
		}
	}
});

module.exports = router;
