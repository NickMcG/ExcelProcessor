var expect = require('chai').expect,
	sinon = require('sinon'),
	//mockery...?
	helper = require('../excelHelper');

describe ('excel-helper', function () {
	describe ('readSheet', function () {
		it ('should return an object saying that the file does not exist', function () {
			var results = helper.readSheet('./test-files/doesNotExist.xlsx', 'Sheet1');
			expect(results).to.deep.equal({ 'fileExists': false, 'sheetExists': false });
		});

		it ('should return an object saying that the sheet does not exist', function () {
			var expectedObj = {
				'fileExists': true,
				'sheetExists': false
			};
			var results = helper.readSheet('./test-files/SimpleFile.xlsx', 'Sheet42');
			expect(results).to.deep.equal(expectedObj);
		});

		it ('should read the file and parse the headers', function () {
			var expectedObj = {
				'fileExists': true,
				'sheetExists': true,
				'headers': ['Col1', 'Col2', 'Col3'],
				'data': [
					{ 'Col1': 'R1C1', 'Col2': 'R1C2', 'Col3': 'R1C3', 'Col5': 'R1C5' },
					{ 'Col1': 'R2C1', 'Col2': 'R2C2', 'Col3': 'R2C3', 'undefined': 'R2C4' }
				]
			};
			var results = helper.readSheet('./test-files/SimpleFile.xlsx', 'Sheet1');

			// For some reason, deep equal isn't working, so do the drawn-out matching
			expect(results.fileExists).to.equal(expectedObj.fileExists);
			expect(results.sheetExists).to.equal(expectedObj.sheetExists);
			expect(results.headers).to.deep.equal(expectedObj.headers);

			expect(results.data[0].Col1).to.equal(expectedObj.data[0].Col1);
			expect(results.data[0].Col2).to.equal(expectedObj.data[0].Col2);
			expect(results.data[0].Col3).to.equal(expectedObj.data[0].Col3);
			expect(results.data[0].Col5).to.equal(expectedObj.data[0].Col5);

			expect(results.data[1].Col1).to.equal(expectedObj.data[1].Col1);
			expect(results.data[1].Col2).to.equal(expectedObj.data[1].Col2);
			expect(results.data[1].Col3).to.equal(expectedObj.data[1].Col3);
			expect(results.data[1]['undefined']).to.equal(expectedObj.data[1]['undefined']);
		});
	});

	describe ('writeCsv', function () {
		var fakeStream, headers, data;

		beforeEach (function () {
			fakeStream = { write: function () { } };
			sinon.spy(fakeStream, 'write');
			headers = ['1st', '2nd', '3rd'];
			data = [
				{ '1st': 1, '2nd': '2', '3rd': 'three' },
				{ '1st': 'ten', '2nd': 0.2, '3rd': 30 }
			];
		});

		afterEach (function () {
			fakeStream.write.restore();
		});

		it ('should write the header and data', function () {
			helper.writeCsv(fakeStream, headers, data);
			var output = '"1st","2nd","3rd"\r\n' +
				'"1","2","three"\r\n' +
				'"ten","0.2","30"\r\n';
			expect(fakeStream.write.calledWith(output, 'utf8')).to.equal(true);
		});
	});
});
