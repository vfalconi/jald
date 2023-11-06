module.exports = [
	{
		match: [ './build/assets/*.{js,css}', './layouts/**/*.kdl' ],
		fn: function (event, file) {
			this.reload();
		}
	}
];
