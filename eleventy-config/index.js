require('dotenv').config();
const collections = require('./collections');
const data = require('./data');
const options = require('./options');
const passthroughCopy = require('./passthroughCopy');
const watchTargets = require('./watchTargets');
const nunjucks = require('./nunjucks');

module.exports = {
	collections,
	nunjucks,
	data,
	options,
	passthroughCopy,
	watchTargets,
}
