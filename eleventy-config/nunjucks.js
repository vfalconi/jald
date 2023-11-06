const Nunjucks = require('nunjucks');
const spacelessExt = require('nunjucks-tag-spaceless');
const icons = require('../lib/Icon');
const fsLoader = new Nunjucks.FileSystemLoader([
	'templates',
	'templates/_data',
	'templates/_partials',
]);

const environment = new Nunjucks.Environment(fsLoader);

environment.addExtension('spaceless', new spacelessExt());
environment.addFilter('icon', icons);

module.exports = environment;
