var router = require('express').Router(),
	fs = require('fs'),
	path = require('path'),
	uploadPath = path.join(process.cwd(), 'uploads');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST file */
router.post('/uploadFile', function (req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		var tempPath = path.join(uploadPath, new Date().getTime().toString()),
			serverFile = path.join(tempPath, filename);
		fs.mkdirSync(tempPath);
		fstream = fs.createWriteStream(serverFile);
		file.pipe(fstream);
		fstream.on('close', function () {
			res.redirect('back');
		});
	});
});

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath);
}

module.exports = router;
