module.exports = {
	htmlTemplateEngine: 'njk',
	dir: {
		input: 'templates',
		data: '_data',
		includes: '_partials',
		output: (process.env.BUILD_DIR || 'output'),
	},
};
