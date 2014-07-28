var expect = require('chai').expect,
	util = require('../utility');

describe ('utility', function () {
	describe ('join', function () {
		it ('should return an empty string if there are no items', function () {
			expect(util.join([])).to.equal('');
		});

		it ('should return back just the first item if there is only one item', function () {
			expect(util.join(['one item'])).to.equal('one item');
		});

		it ('should join array together by the separator', function () {
			expect(util.join(['one item', 'two items', 'three items'], '|'))
				.to.equal('one item|two items|three items');
		});

		it ('should wrap each item with the decorator if one is passed in', function () {
			function decorator (item) {
				return '{{' + item + '}}';
			}
			expect(util.join(['one', 'two', 'three'], '+', decorator))
				.to.equal('{{one}}+{{two}}+{{three}}');
		});

		it ('should not throw an exception if decorator is not a function', function () {
			expect(util.join(['a', 'b', 'c'], ',', {})).to.equal('a,b,c');
		});
	});

	describe ('convertObjectToArray', function () {
		var func = util.convertObjectToArray,
			props = ['a', 'b', 'c'],
			obj = { 'a': 'hi', 'b': 42, 'c': { '1': 'world' } };

		it ('should return the requested properties as an array', function () {
			expect(func(props, obj)).to.deep.equal(['hi', 42, { '1': 'world' }]);
		});

		it ('should only return the requested properties', function () {
			obj.d = 'i am new here!';
			expect(func(props, obj)).to.deep.equal(['hi', 42, { '1': 'world' }]);
		});
	});

	describe ('enquote', function () {
		it ('should wrap the value in quotes', function () {
			expect(util.enquote('hello, world!')).to.equal('"hello, world!"');
		});

		it ('should escape quotes in the value', function () {
			expect(util.enquote('"test!"')).to.equal('"""test!"""');
		});

		it ('should wrap null in quotes', function () {
			expect(util.enquote(null)).to.equal('""');
		});

		it ('should return open/close quotes for an object', function () {
			expect(util.enquote({})).to.equal('""');
		});

		it ('should wrap numeric values in quotes', function () {
			expect(util.enquote(42)).to.equal('"42"');
		});
	});
});