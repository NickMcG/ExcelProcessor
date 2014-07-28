var _ = require('lodash');

module.exports.join = function (data, separator, decorator) {
	return _.reduce(data, function (result, item) {
		if (decorator && typeof decorator === 'function') {
			item = decorator(item);
		}
		if (result) {
			result += separator;
		}
		return result + item;
	}, '');
};

module.exports.convertObjectToArray = function (props, obj) {
	return _.reduce(props, function (result, p) {
		result.push(obj[p]);
		return result;
	}, []);
};

module.exports.enquote = function (value) {
	var escapedValue = "";
	if (value) {
		if (value.replace) {
			escapedValue = value.replace(/"/g, '""');
		}
		else if (typeof value === 'number') {
			escapedValue = value.toString();
		}
	}
	return '"' + escapedValue + '"';
};
