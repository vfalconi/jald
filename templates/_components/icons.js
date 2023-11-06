const icons = require('@mdi/js');

module.exports = (icon) => {
	const iconName = (`mdi-${icon}`).split('-').map((fragment, i) => {
		if (i > 0) {
			return `${fragment.charAt(0).toUpperCase()}${fragment.slice(1)}`;
		}
		return fragment;
	}).join('');

	return icons[iconName];
};
