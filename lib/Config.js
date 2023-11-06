const { readFileSync } = require('fs');
const kdl = require('kdljs');

class Config {
	constructor() {
		this.source = readFileSync('config.kdl', 'utf-8');
		this.kdlDoc = this.parseConfigFile();
	}

	parseConfigFile = () => {
		const parsedConfig = kdl.parse(this.source);

		if (parsedConfig.errors.length > 0) {
			throw new Error(parsedConfig.errors);
		}

		return parsedConfig.output;
	};

	query = (q) => {
		const results = kdl.query(this.kdlDoc, q);

		if (results.length === 1) return results[0];

		return results;
	};
}

module.exports = new Config();
