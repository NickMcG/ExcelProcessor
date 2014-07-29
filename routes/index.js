var router = require('express').Router(),
	fs = require('fs'),
	path = require('path'),
	uploadPath = path.join(process.cwd(), 'uploads'),
	excelHelper = require('../excelHelper');

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
router.post('/uploadFile', function (req, res) {
	var gotFile = false,
		tempPath = path.join(uploadPath, new Date().getTime().toString()),
		configureParams = { 'title': 'Configure Columns', 'tempPath': tempPath };
	req.busboy.on('file', function (fieldname, file, filename) {
		var fstream,
			serverFile = path.join(tempPath, filename);
		configureParams.file = serverFile;
		gotFile = true;

		fs.mkdirSync(tempPath);
		fstream = fs.createWriteStream(serverFile);
		file.pipe(fstream);
		fstream.on('close', function () {
			configureParams.headers = excelHelper.readSheet(configureParams.file, configureParams.sheetName).headers;
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

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

module.exports = router;
