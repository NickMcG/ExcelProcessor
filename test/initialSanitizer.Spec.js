var expect = require('chai').expect,
	sanitizer = require('../initialSanitizer');

describe ('initial-sanitizer', function () {
	it ('should return the value if there are no spaces in it', function () {
		expect(sanitizer('spaceless')).to.equal('spaceless');
	});

	it ('should trim off single initial after the first space', function () {
		expect(sanitizer('spaces 1')).to.equal('spaces');
	});

	it ('should trim off all of the single initials', function () {
		expect(sanitizer('Martin G R R')).to.equal('Martin');
	});

	it ('should not remove words after spaces', function () {
		expect(sanitizer('should not trim')).to.equal('should not trim');
	});
});