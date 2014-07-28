var expect = require('chai').expect,
	sinon = require('sinon'),
	collapser = require('../rowCollapser');

describe('row-collapser', function () {
	var objects, keyProps, intProps;

	function builder (first, last, int, decimal) {
		return {
			'First': first,
			'Last': last,
			'Int': int,
			'Decimal': decimal
		};
	}

	beforeEach(function () {
		objects = [];
		keyProps = ['First', 'Last'];
		intProps = ['Int', 'Decimal'];
		sinon.stub(console, 'log');
	});

	afterEach(function () {
		console.log.restore();
	});

	it ('should convert the numeric properties to numbers', function () {
		objects.push(builder('John', 'Doe', '5', '12.34'));
		var expected = builder('John', 'Doe', 5, 12.34);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected]);
	});

	it ('should not try to parse undefined values', function () {
		objects.push(builder('John', 'Doe', undefined, '12.34'));
		var expected = builder('John', 'Doe', undefined, 12.34);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected]);
	});

	it ('should log an error if a numeric property is not a parseable number', function () {
		objects.push(builder('John', 'Doe', 'five', '12.35'));
		var expected = builder('John', 'Doe', 'five', 12.35);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected]);
		expect(console.log.calledWithExactly('Had an issue parsing property [Int] for item [John|Doe].'))
			.to.equal(true);
	});

	it ('should sum the numeric values of rows that are the same', function () {
		objects.push(builder('John', 'Doe', '5', '12.35'));
		objects.push(builder('John', 'Doe', '7.5', '24.7'));
		var expected = builder('John', 'Doe', 12.5, 37.05);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected]);
	});

	it ('should not sum the numeric values of rows that are not the same', function () {
		objects.push(builder('John', 'Doe', '5', '12.35'));
		objects.push(builder('Jane', 'Doe', '7.5', '24.7'));
		var expected1 = builder('John', 'Doe', 5, 12.35),
			expected2 = builder('Jane', 'Doe', 7.5, 24.7);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected1, expected2]);
	});

	it ('should treat undefined properties as 0 when being summed', function () {
		objects.push(builder('John', 'Doe', '5', '12.35'));
		objects.push(builder('John', 'Doe', undefined, '24.7'));
		var expected = builder('John', 'Doe', 5, 37.05);
		expect(collapser(objects, keyProps, intProps)).to.deep.equal([expected]);
	});
});
