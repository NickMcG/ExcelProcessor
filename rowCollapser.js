var _ = require('lodash'),
	util = require('./utility');

function buildKey (obj, keyProps) {
	return util.join(util.convertObjectToArray(keyProps, obj), '|');
}

function convertPropertiesToNumber (obj, keyProps, intProps) {
	_(intProps).each(function (prop) {
		if (!prop || !obj[prop]) return;
		if (!isNaN(obj[prop])) {
			obj[prop] = parseFloat(obj[prop]);
		}
		else {
			console.log('Had an issue parsing property [' + prop +
				'] for item [' + buildKey(obj, keyProps) + '].');
		}
	});
}

module.exports = function (sheet, keyProps, intProps) {
	_(sheet).each(function (item) {
		convertPropertiesToNumber(item, keyProps, intProps);
	});

	var mappedData = _(sheet).map(function (item) {
		return { 'key': buildKey(item, keyProps), 'item': item };
	});

	var reducedData = _(mappedData).reduce(function (result, obj) {
		var resultObj = result[obj.key],
			newObj = obj.item;
		if (!resultObj) {
			result[obj.key] = newObj;
		}
		else {
			_(intProps).each(function (prop) {
				if (!resultObj[prop]) {
					resultObj[prop] = 0;
				}
				if (newObj[prop]) {
					resultObj[prop] = resultObj[prop] + newObj[prop];
				}
			});
		}
		return result;
	}, {});

	return _.map(reducedData, function (item) {
		return item;
	});
};
