var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST file */
router.post('/uploadFile', function (req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log('Uploading: ' + filename);
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

module.exports = router;
