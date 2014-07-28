var router = require('express').Router(),
	fs = require('fs'),
	path = require('path'),
	uploadPath = path.join(process.cwd(), 'uploads')/*,
	excelHelper = require('../excelHelper')*/;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Excel Processor', 'missingSheetName': req.query.missingSheetName });
});

/* POST file */
router.post('/uploadFile', function (req, res) {
	if (!req.body.sheetName) {
		res.redirect('/?missingSheetName=true');
	}
	else {
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var tempPath = path.join(uploadPath, new Date().getTime().toString()),
				serverFile = path.join(tempPath, filename);
			fs.mkdirSync(tempPath);
			fstream = fs.createWriteStream(serverFile);
			file.pipe(fstream);
			fstream.on('close', function () {
				// TODO: extract headers from the file
				// TODO: Render a page which lets the user select which columns to manipulate
				res.redirect('back');
			});
		});
	}
});

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

module.exports = router;
