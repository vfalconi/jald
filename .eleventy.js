const path = require('node:path');
const appConfig = require('./lib/Config').query('appConfig');
const config = require('./eleventy-config');
const eleventySass = require("eleventy-sass");
const sass = require("sass");

module.exports = function (eleventyConfig) {
	eleventyConfig.setLibrary('njk', config.nunjucks);

	eleventyConfig.setBrowserSyncConfig({
    files: config.watchTargets
  });

  config.passthroughCopy.forEach((copy) => eleventyConfig.addPassthroughCopy(copy));

	/*Object.keys(components).forEach(name => {
		eleventyConfig.addJavaScriptFunction(name, components[name]);
	});*/

	Object.keys(config.data).forEach((name) => {
		eleventyConfig.addGlobalData(name, config.data[name]);
	});

	appConfig.children.forEach(setting => {
		const value = (setting.values.length === 1 ? setting.values.shift() : setting.values);
		eleventyConfig.addGlobalData(setting.name, value);
	});

	Object.keys(config.collections).forEach((name) => {
		eleventyConfig.addCollection(name, config.collections[name]);
	});

	eleventyConfig.addGlobalData('now', new Date());

	eleventyConfig.addPlugin(eleventySass);

	/*Object.keys(config.transforms).forEach((name) => {
		eleventyConfig.addTransform(name, config.transforms[name]);
	});

	Object.keys(config.filters).forEach((name) => {
		eleventyConfig.addFilter(name, config.filters[name]);
	});

	Object.keys(config.plugins).forEach((name) => {
		eleventyConfig.addPlugin(config.plugins[name]);
	});*/

	return config.options;
};
