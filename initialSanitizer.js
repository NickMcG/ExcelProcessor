var initialRegex = / \w$/;
function hasTrailingInitial(value) {
	return value && value.match(initialRegex) !== null;
}

function removeTrailingInitial(value) {
	return value.replace(initialRegex, '');
}

module.exports = function (value) {
	while(hasTrailingInitial(value)) {
		value = removeTrailingInitial(value);
	}
	return value;
};
