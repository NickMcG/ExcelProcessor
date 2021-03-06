var _ = require('lodash'),
	fs = require('fs'),
	xlsx = require('xlsx'),
	util = require('./utility');

function extractHeaders(sheet) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
			'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
		headers = [],
		alphaIndex,
		sheetIndex;

	for (alphaIndex = 0;alphaIndex < alphabet.length;++alphaIndex) {
		sheetIndex = alphabet[alphaIndex] + "1";
		if (sheet[sheetIndex]) {
			headers.push(sheet[sheetIndex].v);
		}
		else {
			break;
		}
	}
	return headers;
}

module.exports.readSheet = function (filePath, sheetName) {
	var fileExists = fs.existsSync(filePath),
		file = fileExists ? xlsx.readFile(filePath) : { 'Sheets': {} },
		sheet = file.Sheets[sheetName],
		results = { 'fileExists': fileExists, 'sheetExists': !!sheet };

	if (sheet) {
		results.headers = extractHeaders(sheet);
		results.data = xlsx.utils.sheet_to_row_object_array(sheet);
	}

	return results;
};

module.exports.writeCsv = function (stream, headers, data) {
	var buffer = _.reduce(data, function (result, item) {
		return result + util.join(util.convertObjectToArray(headers, item), ',', util.enquote) + '\r\n';
	}, util.join(headers, ',', util.enquote) + '\r\n');
	stream.write(buffer, 'utf8');
};
